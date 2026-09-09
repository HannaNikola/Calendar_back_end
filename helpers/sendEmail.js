import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const result = await resend.emails.send({
      to,
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      subject,
      html,
    });

    console.log("RESEND RESULT:", result);

    if (result.error) {
      console.error("RESEND ERROR:", result.error);
      throw new Error(result.error.message);
    }

    return result;
  } catch (err) {
    console.error("SEND EMAIL ERROR:", err);
    throw err;
  }
};
