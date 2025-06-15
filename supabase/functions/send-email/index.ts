
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
  coupleNames?: string;
  websiteUrl?: string;
  guestNames?: { [email: string]: string };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message, recipientType, coupleNames, websiteUrl, guestNames }: EmailRequest = await req.json();

    console.log("Email sending request:", {
      to: to.length > 0 ? `${to.length} recipients` : 'No recipients',
      recipients: to, // Log actual emails for debugging
      subject,
      message: message.substring(0, 100) + "...",
      recipientType,
      coupleNames,
      websiteUrl,
      guestNames: guestNames ? Object.keys(guestNames).length + ' guest names provided' : 'No guest names',
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

    // Send emails to all recipients individually with proper rate limiting
    for (let i = 0; i < to.length; i++) {
      const emailAddress = to[i];
      
      try {
        console.log(`Sending email ${i + 1}/${to.length} to: ${emailAddress}`);
        
        // Get guest name from provided names or extract from email
        const recipientName = guestNames?.[emailAddress] || emailAddress.split('@')[0];
        
        // Replace placeholders in the message with proper escaping
        let personalizedMessage = message
          .replace(/\{name\}/g, recipientName)
          .replace(/\{website_url\}/g, websiteUrl || 'your-wedding-website.com');
        
        // Replace any remaining old references with current couple names and website
        if (coupleNames && websiteUrl) {
          // Replace old domain references
          personalizedMessage = personalizedMessage.replace(/liam-mia-wedding\.lovable\.app/g, websiteUrl.replace(/^https?:\/\//, ''));
          
          // Replace old couple name references
          personalizedMessage = personalizedMessage.replace(/Liam & Mia/g, coupleNames);
          personalizedMessage = personalizedMessage.replace(/Liam and Mia/g, coupleNames.replace(' & ', ' and '));
        }
        
        // Create the sender email with couple names (use noreply@resend.dev for compatibility)
        const fromEmail = `${coupleNames || 'Wedding Couple'} <noreply@resend.dev>`;
        
        const emailResponse = await resend.emails.send({
          from: fromEmail,
          to: [emailAddress], // Send to one recipient at a time
          subject,
          html: personalizedMessage.replace(/\n/g, '<br>'),
        });

        if (emailResponse.error) {
          throw new Error(emailResponse.error.message || 'Unknown error from Resend');
        }

        console.log(`Email sent successfully to ${emailAddress}:`, emailResponse);
        successCount++;
        
        // Add delay between emails to avoid rate limiting (500ms = 2 emails per second max)
        if (i < to.length - 1) { // Don't delay after the last email
          await new Promise(resolve => setTimeout(resolve, 600)); // 600ms delay to be safe
        }
        
      } catch (error: any) {
        console.error(`Failed to send email to ${emailAddress}:`, error);
        errorCount++;
        
        // Provide more specific error messages
        let errorMessage = error.message;
        if (error.message.includes('You can only send testing emails')) {
          errorMessage = `Domain not verified - can only send to verified addresses`;
        } else if (error.message.includes('Too many requests')) {
          errorMessage = `Rate limit exceeded - please try again later`;
        }
        
        errors.push(`${emailAddress}: ${errorMessage}`);
        
        // If rate limited, add extra delay before next email
        if (error.message.includes('Too many requests')) {
          console.log('Rate limited, adding extra delay...');
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
        }
      }
    }

    const allSuccessful = errorCount === 0;
    const statusCode = allSuccessful ? 200 : 207; // 207 = Multi-Status for partial success

    const responseMessage = allSuccessful 
      ? `All emails sent successfully to ${successCount} recipient(s)`
      : `${successCount} emails sent successfully, ${errorCount} failed. Check logs for details.`;

    console.log('Final email sending summary:', {
      total: to.length,
      successful: successCount,
      failed: errorCount,
      errors: errors
    });

    return new Response(
      JSON.stringify({ 
        success: allSuccessful,
        message: responseMessage,
        recipientCount: to.length,
        successCount,
        errorCount,
        errors: errors.length > 0 ? errors : undefined,
        actualEmailsSent: true,
        note: errorCount > 0 ? "Some emails failed due to domain verification or rate limits. Check Resend dashboard for details." : undefined
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
