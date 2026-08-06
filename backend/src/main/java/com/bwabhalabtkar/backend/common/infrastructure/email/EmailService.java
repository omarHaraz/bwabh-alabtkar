package com.bwabhalabtkar.backend.common.infrastructure.email;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    // Replace with your Gmail address
    private static final String FROM = "omarharaz553@gmail.com";

    @Async
    public void sendHtmlEmail(String to, String subject, String otpCode) throws MessagingException {

        Context context = new Context();
        context.setVariable("otpCode", otpCode);

        String htmlContent = templateEngine.process("otp-email", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(FROM);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);

        System.out.println("OTP email sent successfully.");
    }

    @Async
    public void sendWelcomeEmail(String to, String name) throws MessagingException {

        Context context = new Context();
        context.setVariable("name", name);

        String htmlContent = templateEngine.process("welcome-email", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(FROM);
        helper.setTo(to);
        helper.setSubject("Welcome to Bwabh Alabtkar 🎉");
        helper.setText(htmlContent, true);

        mailSender.send(message);

        System.out.println("Welcome email sent successfully.");
    }
}