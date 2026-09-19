export const MALE_LOR_TEMPLATE = `It is a pleasure to write this letter of recommendation for {name}. During his {tenure} {role} internship with us, he demonstrated exceptional dedication, strong professional conduct, and a quick-learning attitude.

As a {role}, he was actively involved in candidate sourcing, initial screening, and coordinating recruitment activities for various open roles. He consistently delivered quality work by managing assigned tasks efficiently and adhering to deadlines. His proactive approach made him a valuable asset to our HR team.

Beyond his functional capabilities, he exhibited excellent communication skills and professionalism throughout his tenure.

I strongly recommend {name} for any future professional opportunities in HR and recruitment, or higher academic endeavors. I am confident he will be a valuable contributor to any organization.

We wish him every success in his future career.

Sincerely,

Aarav Jain

Authorized Signatory`;

export const FEMALE_LOR_TEMPLATE = `It is a pleasure to write this letter of recommendation for {name}. During her {tenure} {role} internship with us, she demonstrated exceptional dedication, strong professional conduct, and a quick-learning attitude.

As a {role}, she was actively involved in candidate sourcing, initial screening, and coordinating recruitment activities for various open roles. She consistently delivered quality work by managing assigned tasks efficiently and adhering to deadlines. Her proactive approach made her a valuable asset to our HR team.

Beyond her functional capabilities, she exhibited excellent communication skills and professionalism throughout her tenure.

I strongly recommend {name} for any future professional opportunities in HR and recruitment, or higher academic endeavors. I am confident she will be a valuable contributor to any organization.

We wish her every success in her future career.

Sincerely,

Aarav Jain

Authorized Signatory`;

export function getTemplateContent(gender: string = "male", dbTemplateContent?: string): string {
  const isFemale = String(gender || "").toLowerCase() === "female";

  if (!dbTemplateContent || dbTemplateContent.trim().length === 0 || dbTemplateContent.includes("they") || dbTemplateContent.includes("them")) {
    return isFemale ? FEMALE_LOR_TEMPLATE : MALE_LOR_TEMPLATE;
  }

  if (isFemale) {
    return dbTemplateContent
      .replace(/\bhis\b/g, "her")
      .replace(/\bHis\b/g, "Her")
      .replace(/\bhe\b/g, "she")
      .replace(/\bHe\b/g, "She")
      .replace(/\bhim\b/g, "her")
      .replace(/\bHim\b/g, "Her");
  } else {
    return dbTemplateContent
      .replace(/\bher\b/g, "his")
      .replace(/\bHer\b/g, "His")
      .replace(/\bshe\b/g, "he")
      .replace(/\bShe\b/g, "He");
  }
}
