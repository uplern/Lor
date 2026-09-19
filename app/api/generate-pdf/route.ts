import React from "react";
import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { Document, Font, Image, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import { getTemplateContent } from "@/lib/genderTemplates";
import { PDFDocument } from "pdf-lib";
import { createServiceRoleClient } from "@/lib/supabaseAdmin";
import { renderTemplate } from "@/lib/renderTemplate";
import QRCode from "qrcode";

export const runtime = "nodejs";

// Disable automatic word hyphenation (e.g. individ-ual)
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    paddingTop: 195,
    paddingBottom: 95,
    paddingHorizontal: 48,
    color: "#111827",
    fontFamily: "Helvetica"
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginBottom: 10
  },
  dateLine: {
    fontSize: 11,
    color: "#374151"
  },
  subtitle: {
    textAlign: "center",
    fontSize: 13.5,
    marginBottom: 18,
    fontWeight: "bold"
  },
  body: {
    textAlign: "justify",
    fontSize: 12,
    lineHeight: 1.72
  },
  bodyParagraph: {
    marginBottom: 14
  },
  closingSection: {
    marginTop: 14,
    position: "relative"
  },
  closingLine: {
    fontSize: 12,
    lineHeight: 1.3,
    marginBottom: 2
  },
  referenceId: {
    marginTop: 16,
    marginBottom: 4,
    fontSize: 9,
    color: "#4b5563"
  },
  candidateId: {
    position: "absolute",
    bottom: 92,
    right: 48,
    fontSize: 9,
    color: "#4b5563",
    textAlign: "right"
  },
  stampOverlay: {
    position: "absolute",
    width: 85,
    height: 85,
    left: 95,
    top: -12,
    objectFit: "contain"
  },
  qrCodeImage: {
    position: "relative",
    width: 55,
    height: 55,
    marginTop: 6,
    objectFit: "contain"
  }
});

function formatToday(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function toDataUri(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null;

  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === ".png" ? "image/png" : "image/jpeg";
  const base64 = fs.readFileSync(filePath).toString("base64");
  return `data:${mime};base64,${base64}`;
}

function splitBodyAndClosing(content: string): { body: string; closing: string[] } {
  const normalized = content.replace(/\r\n/g, "\n").trim();
  const marker = normalized.toLowerCase().lastIndexOf("\nsincerely,");

  if (marker === -1) return { body: normalized, closing: [] };

  const body = normalized.slice(0, marker).trim();
  const closingText = normalized.slice(marker + 1).trim();
  const closingLines = closingText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return { body, closing: closingLines };
}

function buildReferenceId(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i += 1) {
    hash = (hash * 31 + content.charCodeAt(i)) >>> 0;
  }
  const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `UPLERN-LOR-${dateTag}-${hash.toString(16).slice(0, 6).toUpperCase()}`;
}

function createLORDocument(content: string, signSealSrc: string | null, qrCodeSrc: string | null) {
  const { body, closing } = splitBodyAndClosing(content);
  const referenceId = buildReferenceId(content);
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const defaultClosing = ["Sincerely,", "Aarav Jain", "Authorized Signatory"];
  const closingLines = closing.length > 0 ? closing : defaultClosing;

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.dateLine }, `Date: ${formatToday()}`)
      ),
      React.createElement(Text, { style: styles.subtitle }, "To whomsoever it may concern"),
      React.createElement(
        View,
        { style: styles.body },
        ...paragraphs.map((line, index) =>
          React.createElement(Text, { key: `p-${index}`, style: styles.bodyParagraph }, line)
        )
      ),
      React.createElement(
        View,
        { style: styles.closingSection },
        ...closingLines.map((line, index) =>
          React.createElement(Text, { key: `c-${index}`, style: styles.closingLine }, line)
        ),
        signSealSrc ? React.createElement(Image, { src: signSealSrc, style: styles.stampOverlay }) : null,
        qrCodeSrc ? React.createElement(Image, { src: qrCodeSrc, style: styles.qrCodeImage }) : null
      ),
      // Candidate ID — absolutely positioned at bottom-right above footer
      React.createElement(
        View,
        { style: styles.candidateId },
        React.createElement(Text, null, `Candidate ID: ${referenceId}`)
      )
    )
  );
}

export async function POST(request: Request) {
  const supabase = createServiceRoleClient();
  try {
    const { token, fileName } = await request.json();
    const cleanToken = String(token || "").trim();

    if (!cleanToken) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const { data: user, error: userErr } = await supabase
      .from("lor_users")
      .select("*")
      .eq("token", cleanToken)
      .maybeSingle();

    if (userErr || !user) {
      return NextResponse.json({ error: "Record not found", details: userErr }, { status: 404 });
    }

    if (user.last_downloaded_at) {
      const timeDiff = Date.now() - new Date(user.last_downloaded_at).getTime();
      if (timeDiff < 60000) {
        return NextResponse.json({ error: "Please wait 1 minute before generating another copy." }, { status: 429 });
      }
    }

    await supabase
      .from("lor_users")
      .update({ last_downloaded_at: new Date().toISOString() })
      .eq("token", cleanToken);

    const { data: template, error: templateErr } = await supabase
      .from("templates")
      .select("template_content,is_active")
      .eq("id", user.template_id)
      .eq("is_active", true)
      .maybeSingle();

    if (templateErr || !template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const today = formatToday();
    const templateText = getTemplateContent(user.gender || "male", template.template_content);

    const safeContent = renderTemplate(templateText, {
      name: user.name,
      Name: user.name,
      role: user.role,
      Role: user.role,
      tenure: user.tenure,
      Tenure: user.tenure,
      date: today,
      Date: today
    });

    const assetsDir = path.join(process.cwd(), "public", "assets");
    const signSealSrc = toDataUri(path.join(assetsDir, "seal&sign.png"));

    const { origin } = new URL(request.url);
    const verificationUrl = `${origin}/verify?token=${cleanToken}`;
    const qrCodeSrc = await QRCode.toDataURL(verificationUrl, { margin: 1, width: 128 });

    const fgBlob = await pdf(createLORDocument(safeContent, signSealSrc, qrCodeSrc)).toBlob();
    const fgBuffer = Buffer.from(await fgBlob.arrayBuffer());

    const bgPdfPath = path.join(assetsDir, "bg_lor.pdf");
    let buffer: Buffer;

    if (fs.existsSync(bgPdfPath)) {
      const bgBuffer = fs.readFileSync(bgPdfPath);
      const bgDoc = await PDFDocument.load(bgBuffer);
      const fgDoc = await PDFDocument.load(fgBuffer);

      const [embeddedFgPage] = await bgDoc.embedPdf(fgDoc, [0]);
      const bgPage = bgDoc.getPage(0);
      bgPage.drawPage(embeddedFgPage, { x: 0, y: 0 });

      const finalPdfBytes = await bgDoc.save();
      buffer = Buffer.from(finalPdfBytes);
    } else {
      buffer = fgBuffer;
    }

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName || "LOR.pdf"}"`
      }
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate PDF", details: (error as Error).message }, { status: 500 });
  }
}