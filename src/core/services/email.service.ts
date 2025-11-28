import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configurar transportador de email con Google App Password
    this.transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER || '8a19ac0affcc2d',
        pass: process.env.MAILTRAP_PASS || '9f1bd5117e4a18',
      },
    });
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('[EMAIL SERVICE] Error connecting to Mailtrap SMTP:', error);
      } else {
        console.log('[EMAIL SERVICE] Mailtrap SMTP connection successful');
      }
    });
  }

  /**
   * Envía un correo de verificación de email
   */
  async sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;

    const htmlContent = `
      <h2>¡Bienvenido a Notes!</h2>
      <p>Por favor, verifica tu correo electrónico haciendo clic en el siguiente enlace:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Verificar Email
      </a>
      <p>O copia y pega este enlace en tu navegador:</p>
      <p>${verificationUrl}</p>
      <p>Este enlace expira en 24 horas.</p>
      <p>Si no creaste esta cuenta, ignora este correo.</p>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.GOOGLE_APP_EMAIL,
        to: email,
        subject: 'Verifica tu email - Notes App',
        html: htmlContent,
      });
      console.log(`[EMAIL SERVICE] Verification email sent to: ${email}`);
    } catch (error) {
      console.error(`[EMAIL SERVICE] Error sending verification email to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Envía un correo de recuperación de contraseña
   */
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    const htmlContent = `
      <h2>Recuperación de Contraseña</h2>
      <p>Hemos recibido una solicitud para resetear tu contraseña. Haz clic en el siguiente enlace:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">
        Resetear Contraseña
      </a>
      <p>O copia y pega este enlace en tu navegador:</p>
      <p>${resetUrl}</p>
      <p>Este enlace expira en 15 minutos.</p>
      <p>Si no solicitaste este reset, ignora este correo.</p>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.GOOGLE_APP_EMAIL,
        to: email,
        subject: 'Recupera tu contraseña - Notes App',
        html: htmlContent,
      });
      console.log(`[EMAIL SERVICE] Password reset email sent to: ${email}`);
    } catch (error) {
      console.error(`[EMAIL SERVICE] Error sending password reset email to ${email}:`, error);
      throw error;
    }
  }
}

