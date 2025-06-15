
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

    console.log("=== EMAIL SENDING STARTED ===");
    console.log("Email sending request:", {
      to: to.length > 0 ? `${to.length} recipients` : 'No recipients',
      recipients: to,
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
    const sendingLog: string[] = [];

    // Send emails to all recipients individually with proper rate limiting
    for (let i = 0; i < to.length; i++) {
      const emailAddress = to[i];
      
      try {
        console.log(`\n--- EMAIL ${i + 1}/${to.length} ---`);
        console.log(`Preparing email for: ${emailAddress}`);
        
        // Get guest name from provided names or extract from email
        const recipientName = guestNames?.[emailAddress] || emailAddress.split('@')[0];
        console.log(`Recipient name: ${recipientName}`);
        
        // Replace placeholders in the message with proper escaping
        let personalizedMessage = message;
        
        // Replace {name} placeholder
        personalizedMessage = personalizedMessage.replace(/\{name\}/g, recipientName);
        console.log(`After name replacement: ${personalizedMessage.substring(0, 50)}...`);
        
        // Replace {website_url} placeholder
        if (websiteUrl) {
          personalizedMessage = personalizedMessage.replace(/\{website_url\}/g, websiteUrl);
          console.log(`After website URL replacement: ${personalizedMessage.substring(0, 50)}...`);
        }
        
        // COMPREHENSIVE replacement of couple names in all parts of the message
        if (coupleNames) {
          console.log(`Replacing all couple name references with: ${coupleNames}`);
          
          // Replace various couple name formats (case insensitive)
          personalizedMessage = personalizedMessage.replace(/Liam\s*&\s*Mia/gi, coupleNames);
          personalizedMessage = personalizedMessage.replace(/Liam\s*and\s*Mia/gi, coupleNames.replace(' & ', ' and '));
          personalizedMessage = personalizedMessage.replace(/Liam\s*\+\s*Mia/gi, coupleNames.replace(' & ', ' + '));
          
          // Replace in URL paths and parameters (more comprehensive)
          personalizedMessage = personalizedMessage.replace(/liam-mia/gi, coupleNames.toLowerCase().replace(' & ', '-').replace(' and ', '-'));
          personalizedMessage = personalizedMessage.replace(/liam_mia/gi, coupleNames.toLowerCase().replace(' & ', '_').replace(' and ', '_'));
          
          console.log(`After couple name replacement: ${personalizedMessage.substring(0, 100)}...`);
        }
        
        // COMPREHENSIVE domain/URL replacement
        if (websiteUrl) {
          const cleanWebsiteUrl = websiteUrl.replace(/^https?:\/\//, '');
          console.log(`Replacing domains with: ${cleanWebsiteUrl}`);
          
          // Replace all possible old domain references
          personalizedMessage = personalizedMessage.replace(/liam-mia-wedding\.lovable\.app/gi, cleanWebsiteUrl);
          personalizedMessage = personalizedMessage.replace(/preview--ethereal-wedding-tales\.lovable\.app/gi, cleanWebsiteUrl);
          personalizedMessage = personalizedMessage.replace(/ethereal-wedding-tales\.lovable\.app/gi, cleanWebsiteUrl);
          
          // Replace any full URLs that might contain old domains
          personalizedMessage = personalizedMessage.replace(/https?:\/\/liam-mia-wedding\.lovable\.app/gi, websiteUrl);
          personalizedMessage = personalizedMessage.replace(/https?:\/\/preview--ethereal-wedding-tales\.lovable\.app/gi, websiteUrl);
          personalizedMessage = personalizedMessage.replace(/https?:\/\/ethereal-wedding-tales\.lovable\.app/gi, websiteUrl);
          
          console.log(`After domain replacement: ${personalizedMessage.substring(0, 100)}...`);
        }
        
        // Create the sender email with couple names (use noreply@resend.dev for compatibility)
        const fromEmail = `${coupleNames || 'Wedding Couple'} <noreply@resend.dev>`;
        console.log(`From email: ${fromEmail}`);
        
        console.log(`Sending email ${i + 1}/${to.length} to: ${emailAddress}`);
        sendingLog.push(`Sending to ${emailAddress}...`);
        
        const emailResponse = await resend.emails.send({
          from: fromEmail,
          to: [emailAddress], // Send to one recipient at a time
          subject,
          html: personalizedMessage.replace(/\n/g, '<br>'),
        });

        if (emailResponse.error) {
          throw new Error(emailResponse.error.message || 'Unknown error from Resend');
        }

        console.log(`✅ EMAIL SENT SUCCESSFULLY to ${emailAddress}`);
        console.log(`Email ID: ${emailResponse.data?.id}`);
        sendingLog.push(`✅ Sent successfully to ${emailAddress}`);
        successCount++;
        
        // Add delay between emails to avoid rate limiting (700ms delay for safety)
        if (i < to.length - 1) {
          console.log(`⏳ Waiting 700ms before next email...`);
          sendingLog.push(`⏳ Waiting 700ms before next email...`);
          await new Promise(resolve => setTimeout(resolve, 700));
        }
        
      } catch (error: any) {
        console.error(`❌ FAILED to send email to ${emailAddress}:`, error);
        errorCount++;
        
        // Provide more specific error messages
        let errorMessage = error.message;
        if (error.message.includes('You can only send testing emails')) {
          errorMessage = `Domain not verified - can only send to verified addresses. Verify your domain at resend.com/domains`;
        } else if (error.message.includes('Too many requests')) {
          errorMessage = `Rate limit exceeded - please try again later`;
        }
        
        errors.push(`${emailAddress}: ${errorMessage}`);
        sendingLog.push(`❌ Failed: ${emailAddress} - ${errorMessage}`);
        
        // If rate limited, add extra delay before next email
        if (error.message.includes('Too many requests')) {
          console.log('⏳ Rate limited, adding extra delay...');
          sendingLog.push('⏳ Rate limited, adding extra delay...');
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
        }
      }
    }

    const allSuccessful = errorCount === 0;
    const statusCode = allSuccessful ? 200 : 207; // 207 = Multi-Status for partial success

    const responseMessage = allSuccessful 
      ? `All emails sent successfully to ${successCount} recipient(s)`
      : `${successCount} emails sent successfully, ${errorCount} failed. Check logs for details.`;

    console.log('\n=== FINAL EMAIL SENDING SUMMARY ===');
    console.log('Sending log:', sendingLog);
    console.log('Final summary:', {
      total: to.length,
      successful: successCount,
      failed: errorCount,
      errors: errors
    });
    console.log('=== EMAIL SENDING COMPLETED ===\n');

    return new Response(
      JSON.stringify({ 
        success: allSuccessful,
        message: responseMessage,
        recipientCount: to.length,
        successCount,
        errorCount,
        errors: errors.length > 0 ? errors : undefined,
        sendingLog: sendingLog,
        actualEmailsSent: true,
        note: errorCount > 0 ? "Some emails failed due to domain verification or rate limits. You can only send to verified email addresses unless you verify a domain at resend.com/domains" : undefined
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
