package com.bwabhalabtkar.backend.auth.service;



import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    @Autowired
    private Resend resend;

    @Autowired
    private TemplateEngine templateEngine;

    @Async
    public void sendHtmlEmail(String to, String subject, String otpCode) throws ResendException {

        // Prepare Thymeleaf variables
        Context context = new Context();
        context.setVariable("otpCode", otpCode);

        // Generate HTML from template
        String htmlContent = templateEngine.process("otp-email", context);

        // Create the email request
        CreateEmailOptions request = CreateEmailOptions.builder()
                .from("bwabhalabtkar <onboarding@resend.dev>")
                .to(to)
                .subject(subject)
                .html(htmlContent)
                .build();

        // Send email
        CreateEmailResponse data = resend.emails().send(request);
    }


    @Async
    public void sendWelcomeEmail(String to, String name) throws ResendException {

        Context context = new Context();
        context.setVariable("name", name);

        String html = templateEngine.process("welcome-email", context);

        CreateEmailOptions request = CreateEmailOptions.builder()
                .from("bwabhalabtkar <onboarding@resend.dev>")
                .to(to)
                .subject("Welcome to StyleSphere 🎉")
                .html(html)
                .build();

        resend.emails().send(request);
    }


}


