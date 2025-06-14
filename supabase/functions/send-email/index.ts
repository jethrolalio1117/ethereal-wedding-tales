
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  subject: string;
  message: string;
  recipientType: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message, recipientType }: EmailRequest = await req.json();

    console.log("Email sending request:", {
      to: to.length > 0 ? `${to.length} recipients` : 'No recipients',
      subject,
      message: message.substring(0, 100) + "...",
      recipientType,
      timestamp: new Date().toISOString()
    });

    // Check if Resend API key is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured - running in demo mode");
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Demo mode: Emails not actually sent (Resend API key not configured)",
          recipientCount: to.length,
          actualEmailsSent: false
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Initialize Resend with the API key
    const resend = new Resend(resendApiKey);
    
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Send emails to all recipients
    for (const email of to) {
      try {
        console.log(`Sending email to: ${email}`);
        
        const emailResponse = await resend.emails.send({
          from: 'Liam & Mia Wedding <noreply@resend.dev>',
          to: [email],
          subject,
          html: message.replace(/\n/g, '<br>'),
        });

        console.log(`Email sent successfully to ${email}:`, emailResponse);
        successCount++;
      } catch (error: any) {
        console.error(`Failed to send email to ${email}:`, error);
        errorCount++;
        errors.push(`${email}: ${error.message}`);
      }
    }

    const allSuccessful = errorCount === 0;
    const statusCode = allSuccessful ? 200 : 207; // 207 = Multi-Status for partial success

    return new Response(
      JSON.stringify({ 
        success: allSuccessful,
        message: allSuccessful 
          ? `All emails sent successfully to ${successCount} recipient(s)`
          : `${successCount} emails sent successfully, ${errorCount} failed`,
        recipientCount: to.length,
        successCount,
        errorCount,
        errors: errors.length > 0 ? errors : undefined,
        actualEmailsSent: true
      }),
      {
        status: statusCode,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Check the function logs for more information"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
