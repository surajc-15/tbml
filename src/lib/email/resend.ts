import { Resend } from 'resend';
import { renderContactNotificationEmail } from './templates'; // I will create/update this or just use simple text

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactNotification(data: ContactFormData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Simulating email send:', data);
    return { success: true, simulated: true };
  }

  try {
    const { data: responseData, error } = await resend.emails.send({
      from: 'TBML Dashboard <onboarding@resend.dev>', // Resend's default testing domain
      to: 'surajcdev@gmail.com',
      subject: `New Contact Request: ${data.subject}`,
      html: `
        <div style="font-family: sans-serif; max-w-xl; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <hr />
          <h3>Message:</h3>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data: responseData };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
