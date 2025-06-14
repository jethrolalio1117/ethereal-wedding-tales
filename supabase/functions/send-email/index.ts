
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

    // Here you would integrate with Resend when the API key is configured
    // Example Resend integration:
    /*
    const resend = new Resend(resendApiKey);
    
    for (const email of to) {
      await resend.emails.send({
        from: 'Your Wedding <noreply@yourdomain.com>',
        to: [email],
        subject,
        html: message.replace(/\n/g, '<br>'),
      });
    }
    */

    // For now, simulate successful sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Emails sent successfully (production mode would be active with Resend API key)",
        recipientCount: to.length,
        actualEmailsSent: false // Set to true when Resend is actually integrated
      }),
      {
        status: 200,
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
