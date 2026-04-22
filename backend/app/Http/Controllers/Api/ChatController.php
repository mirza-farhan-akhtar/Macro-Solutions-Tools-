<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use App\Models\ChatMessage;
use App\Models\Service;
use App\Models\AIService;
use App\Models\FAQ;
use App\Models\Career;
use App\Models\TeamMember;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    // ── Bot knowledge base ────────────────────────────────────────────────────
    private function getBotReply(string $message): string
    {
        $msg = strtolower(trim($message));

        // Greetings
        if (preg_match('/\b(hi|hello|hey|good\s*(morning|afternoon|evening)|howdy|greetings)\b/', $msg)) {
            $greets = [
                "Hi there! 👋 Welcome to MACRO Solutions Tools Ltd. I'm Mac, your virtual assistant. How can I help you today?",
                "Hello! Great to have you here. I'm Mac, MACRO's AI assistant. What can I help you with?",
                "Hey! Welcome to MACRO Solutions. I'm here to help — feel free to ask me anything!",
            ];
            return $greets[array_rand($greets)];
        }

        // Services
        if (preg_match('/\b(service|services|what do you (do|offer)|what.*(offer|provide)|capabilities|solutions)\b/', $msg)) {
            return "We offer a wide range of tech services:\n\n🌐 **Web & App Development**\n📱 Mobile App Development\n⚙️ Custom Software Development\n🎨 UI/UX Design\n☁️ Cloud Solutions & DevOps\n🔒 Cybersecurity\n🤖 AI & Machine Learning\n📊 Data Analytics\n🛒 E-commerce Solutions\n\nWould you like to know more about any specific service?";
        }

        // Web development
        if (preg_match('/\b(web(site)?|web\s*dev|frontend|backend|react|laravel|wordpress)\b/', $msg)) {
            return "Our **Web Development** team builds fast, modern, scalable websites and web apps using technologies like React, Laravel, Next.js and more. We handle everything from design to deployment. 🌐\n\nWant to discuss your web project? Click 'Connect with a Person' and our team will reach out!";
        }

        // Mobile app
        if (preg_match('/\b(mobile|app|ios|android|flutter|react native)\b/', $msg)) {
            return "We build cross-platform and native **Mobile Apps** for iOS and Android using Flutter, React Native, and native SDKs. 📱\n\nReady to bring your app idea to life? Our team would love to chat!";
        }

        // AI / ML
        if (preg_match('/\b(ai|artificial intelligence|machine learning|ml|chatgpt|automation|nlp|data science)\b/', $msg)) {
            return "MACRO has a dedicated **AI & Machine Learning** division! We build:\n\n🤖 Custom AI Models\n📊 Predictive Analytics\n🗣️ NLP & Chatbots\n🔍 Computer Vision\n⚡ Intelligent Automation\n\nCheck out our AI Services page for more details, or connect with our AI specialists!";
        }

        // Cloud
        if (preg_match('/\b(cloud|aws|azure|gcp|devops|docker|kubernetes|ci\/cd|migration|hosting)\b/', $msg)) {
            return "Our **Cloud & DevOps** team handles:\n\n☁️ Cloud Migration (AWS, Azure, GCP)\n🔄 CI/CD Pipeline Setup\n🐳 Docker & Kubernetes\n📈 Auto-scaling & Monitoring\n🛡️ Cloud Security\n\nLet us help you move to the cloud or optimise your existing setup!";
        }

        // Cybersecurity
        if (preg_match('/\b(cyber|security|hack|penetration|pentest|vulnerability|firewall|compliance)\b/', $msg)) {
            return "Our **Cybersecurity** experts protect your business with:\n\n🔒 Penetration Testing\n🛡️ Security Audits\n📋 Compliance (ISO 27001, GDPR)\n🔐 Identity & Access Management\n🚨 Incident Response\n\nSecurity is non-negotiable — want to talk to our security team?";
        }

        // Pricing / cost
        if (preg_match('/\b(price|pricing|cost|how much|budget|rate|quote|estimate|fees?|charge)\b/', $msg)) {
            return "Our pricing depends on project scope and requirements. We offer flexible engagement models:\n\n💼 **Fixed Price** — for well-defined projects\n⏰ **Time & Material** — for agile/evolving projects\n🤝 **Dedicated Team** — for ongoing partnerships\n\nFor an accurate quote, please share your project details. Want to connect with our team?";
        }

        // Contact / reach
        if (preg_match('/\b(contact|email|phone|call|reach|address|location|office|talk\s*to)\b/', $msg)) {
            return "You can reach MACRO Solutions through:\n\n📧 **Email:** info@macrosolutions.com\n📞 **Phone:** +1 (555) 000-1234\n🌐 **Website:** www.macrosolutions.com\n📍 **Office:** Available on our Contact page\n\nOr just click **'Connect with a Person'** below and someone from our team will be with you shortly!";
        }

        // About / company
        if (preg_match('/\b(about|company|who are you|macro|founded|history|mission|vision)\b/', $msg)) {
            return "**MACRO Solutions Tools Ltd** is a full-service technology company helping businesses build, scale, and secure their digital products.\n\n✅ 10+ years of experience\n✅ 200+ successful projects\n✅ 50+ technology experts\n✅ Clients across 20+ countries\n\nWe partner with startups, enterprises, and government agencies worldwide. How can we help you?";
        }

        // Team / people
        if (preg_match('/\b(team|people|developers?|engineers?|designers?|staff|employees?|experts?)\b/', $msg)) {
            return "Our **team of 50+ experts** includes:\n\n👨‍💻 Full-stack Developers\n🎨 UI/UX Designers\n☁️ Cloud Architects\n🤖 AI/ML Engineers\n🔒 Cybersecurity Specialists\n📊 Data Analysts\n\nVisit our Team page to meet the people behind MACRO!";
        }

        // Careers / jobs
        if (preg_match('/\b(career|job|hiring|vacancy|vacancies|apply|position|opening|work\s*with|join)\b/', $msg)) {
            return "We're always looking for talented people! 🚀\n\nCheck out our **Careers page** for current openings. We offer:\n\n✨ Competitive salaries\n🏠 Remote-friendly culture\n📈 Growth opportunities\n🎓 Learning & development budget\n\nInterested? Visit /careers to apply or connect with our HR team!";
        }

        // Industries
        if (preg_match('/\b(industry|industries|sector|healthcare|finance|retail|education|government|ecommerce|startup)\b/', $msg)) {
            return "We serve clients across many industries:\n\n🏥 Healthcare & Medical\n💰 Finance & Banking\n🛒 Retail & E-commerce\n🎓 Education & EdTech\n🏛️ Government & Public Sector\n🚀 Startups\n🏗️ Construction & Real Estate\n✈️ Travel & Hospitality\n\nVisit our **'Who We Help'** page to see industry-specific solutions!";
        }

        // Timeline / how long
        if (preg_match('/\b(how long|timeline|duration|time(frame)?|deadline|when|delivery|turnaround)\b/', $msg)) {
            return "Project timelines vary by complexity:\n\n⚡ **Simple Website:** 2–4 weeks\n📱 **Mobile App (MVP):** 6–12 weeks\n🏗️ **Custom Software:** 3–6 months\n🤖 **AI/ML Solution:** 2–4 months\n\nWe always provide a detailed project plan upfront. Want a tailored estimate?";
        }

        // Process / how does it work
        if (preg_match('/\b(process|how does it work|start|begin|get started|workflow|methodology|agile|scrum)\b/', $msg)) {
            return "Our proven delivery process:\n\n1️⃣ **Discovery** — We understand your goals & requirements\n2️⃣ **Planning** — Architecture, timeline & resource allocation\n3️⃣ **Design** — UI/UX prototypes for your approval\n4️⃣ **Development** — Agile sprints with regular updates\n5️⃣ **Testing** — Quality assurance & bug fixes\n6️⃣ **Launch** — Deployment & go-live support\n7️⃣ **Support** — Ongoing maintenance & growth\n\nReady to start? Let's talk!";
        }

        // Thank you
        if (preg_match('/\b(thank(s| you)|cheers|great|awesome|perfect|wonderful)\b/', $msg)) {
            return "You're welcome! 😊 Is there anything else I can help you with? I'm here 24/7.\n\nIf you'd like to discuss a project or need expert advice, don't hesitate to connect with our team!";
        }

        // Bye
        if (preg_match('/\b(bye|goodbye|see you|cya|later|take care)\b/', $msg)) {
            return "Goodbye! 👋 It was great chatting with you. Feel free to come back anytime. Have a wonderful day!";
        }

        // Default
        $defaults = [
            "That's a great question! Let me connect you with a specialist who can give you a precise answer. Click **'Connect with a Person'** below and we'll get right back to you! 🙋",
            "I want to make sure you get the best answer. For this, I'd recommend speaking with one of our team members. Click **'Connect with a Person'** and we'll be in touch shortly!",
            "I'm not 100% sure about that, but our team definitely can help! You can also explore our website for more information, or click **'Connect with a Person'** to chat with a specialist.",
        ];
        return $defaults[array_rand($defaults)];
    }

    // ── Start or resume session ───────────────────────────────────────────────
    public function startSession(Request $request)
    {
        $request->validate([
            'session_token' => 'nullable|uuid',
            'page_url'      => 'nullable|string|max:500',
        ]);

        // Try to resume existing session
        if ($request->session_token) {
            $session = ChatSession::with('messages')
                ->where('session_token', $request->session_token)
                ->whereNotIn('status', ['closed'])
                ->first();

            if ($session) {
                return response()->json([
                    'session_token' => $session->session_token,
                    'status'        => $session->status,
                    'visitor_name'  => $session->visitor_name,
                    'messages'      => $session->messages,
                ]);
            }
        }

        // Create new session
        $session = ChatSession::create([
            'page_url'         => $request->page_url,
            'ip_address'       => $request->ip(),
            'user_agent'       => $request->userAgent(),
            'last_activity_at' => now(),
        ]);

        // Welcome message
        $welcome = ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender'          => 'bot',
            'message'         => "Hi! 👋 I'm **Mac**, MACRO's virtual assistant. I'm here to help you 24/7.\n\nYou can ask me about our services, pricing, team, careers, or anything else. What's on your mind today?",
        ]);

        $session->update(['message_count' => 1]);

        return response()->json([
            'session_token' => $session->session_token,
            'status'        => $session->status,
            'visitor_name'  => $session->visitor_name,
            'messages'      => [$welcome],
        ]);
    }

    // ── Send a message ────────────────────────────────────────────────────────
    public function sendMessage(Request $request)
    {
        $request->validate([
            'session_token' => 'required|uuid',
            'message'       => 'required|string|max:2000',
        ]);

        $session = ChatSession::where('session_token', $request->session_token)->firstOrFail();

        // Save visitor message
        ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender'          => 'visitor',
            'message'         => $request->message,
        ]);

        $session->increment('message_count');
        $session->update(['last_activity_at' => now()]);

        // If assigned to human, don't reply with bot
        if (in_array($session->status, ['assigned', 'human_requested'])) {
            return response()->json([
                'reply'  => null,
                'status' => $session->status,
            ]);
        }

        // Generate bot reply
        $replyText = $this->getBotReply($request->message);

        $reply = ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender'          => 'bot',
            'message'         => $replyText,
        ]);

        $session->increment('message_count');

        return response()->json([
            'reply'  => $reply,
            'status' => $session->status,
        ]);
    }

    // ── Request human agent ───────────────────────────────────────────────────
    public function requestHuman(Request $request)
    {
        $request->validate([
            'session_token'  => 'required|uuid',
            'visitor_name'   => 'required|string|max:255',
            'visitor_email'  => 'required|email|max:255',
            'visitor_phone'  => 'nullable|string|max:50',
        ]);

        $session = ChatSession::where('session_token', $request->session_token)->firstOrFail();

        $session->update([
            'visitor_name'        => $request->visitor_name,
            'visitor_email'       => $request->visitor_email,
            'visitor_phone'       => $request->visitor_phone,
            'status'              => 'human_requested',
            'human_requested_at'  => now(),
        ]);

        // System message in chat
        ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender'          => 'bot',
            'message'         => "✅ Got it, **{$request->visitor_name}**! I've notified our team and someone will join this chat shortly.\n\nAverage response time: **under 2 hours** during business hours.\n\nFeel free to continue describing your needs below — our agent will see your full conversation!",
        ]);

        $session->increment('message_count', 1);

        return response()->json(['success' => true, 'status' => 'human_requested']);
    }

    // ── Get session messages (for polling) ────────────────────────────────────
    public function getMessages(Request $request, string $token)
    {
        $session = ChatSession::with('messages')
            ->where('session_token', $token)
            ->firstOrFail();

        // Mark agent messages as read
        $session->messages()->where('sender', 'agent')->where('is_read', false)->update(['is_read' => true]);

        return response()->json([
            'status'        => $session->status,
            'visitor_name'  => $session->visitor_name,
            'messages'      => $session->messages,
            'assigned_agent'=> $session->assignedAgent?->name,
        ]);
    }
}
