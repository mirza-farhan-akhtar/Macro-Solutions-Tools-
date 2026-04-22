<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Service;
use App\Models\AIService;
use App\Models\Blog;
use App\Models\FAQ;
use App\Models\TeamMember;
use App\Models\Career;
use App\Models\Lead;
use App\Models\Page;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed Permissions and Roles first
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
            FinancePermissionSeeder::class,
            HRPermissionSeeder::class,
        ]);

        // Create admin user
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@macro.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
        ]);

        // Assign Super Admin role to the admin user
        $admin->assignRole('super-admin');

        // Create regular user
        User::create([
            'name' => 'John Doe',
            'email' => 'user@macro.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'status' => 'active',
        ]);

        // Create Finance Manager test user
        $financeManager = User::create([
            'name' => 'Finance Manager',
            'email' => 'finance@macro.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'status' => 'active',
        ]);

        // Assign Finance Manager role
        $financeManager->assignRole('finance-manager');

        // Create HR Manager test user
        $hrManager = User::create([
            'name' => 'HR Manager',
            'email' => 'hr@macro.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'status' => 'active',
        ]);

        // Assign HR Manager role
        $hrManager->assignRole('hr-manager');

        // Services
        Service::create([
            'title' => 'Web Development',
            'slug' => 'web-development',
            'excerpt' => 'Custom web applications built with modern technologies',
            'content' => '<p>We create cutting-edge web applications using the latest technologies and best practices. Our team specializes in building scalable, secure, and performant web solutions.</p>',
            'icon' => 'Code',
            'status' => 'published',
            'sort_order' => 1,
            'features' => [
                'Custom web application development',
                'Responsive design implementation',
                'Modern frontend frameworks (React, Vue, Angular)',
                'Robust backend APIs and databases',
                'SEO optimization and performance tuning',
                'Progressive Web App (PWA) development'
            ],
            'benefits' => [
                'Enhanced online presence and user engagement',
                'Improved business efficiency through automation',
                'Scalable architecture for future growth',
                'Better SEO and search visibility',
                'Cross-platform compatibility'
            ],
            'process_steps' => [
                ['title' => 'Requirements Analysis', 'description' => 'Understanding your business needs and technical requirements'],
                ['title' => 'Design & Architecture', 'description' => 'Creating user-friendly designs and scalable architecture'],
                ['title' => 'Development & Testing', 'description' => 'Building and rigorously testing your web application'],
                ['title' => 'Deployment & Support', 'description' => 'Launching your application and providing ongoing maintenance']
            ],
            'technologies' => ['React', 'Vue.js', 'Node.js', 'Laravel', 'PostgreSQL', 'AWS']
        ]);

        Service::create([
            'title' => 'Mobile App Development',
            'slug' => 'mobile-app-development',
            'excerpt' => 'Native and cross-platform mobile applications',
            'content' => '<p>Build stunning mobile applications for iOS and Android platforms. We use React Native and Flutter to deliver high-quality cross-platform solutions.</p>',
            'icon' => 'Smartphone',
            'status' => 'published',
            'sort_order' => 2,
            'features' => [
                'Native iOS and Android development',
                'Cross-platform React Native & Flutter apps',
                'App Store optimization and deployment',
                'Push notifications and real-time features',
                'Offline functionality and data sync',
                'Comprehensive app testing and QA'
            ],
            'benefits' => [
                'Reach customers on their preferred devices',
                'Increased customer engagement and retention',
                'Access to device-specific features',
                'Offline functionality for better user experience',
                'Revenue growth through mobile channels'
            ],
            'process_steps' => [
                ['title' => 'Strategy & Planning', 'description' => 'Defining app strategy, target audience, and feature roadmap'],
                ['title' => 'UI/UX Design', 'description' => 'Creating intuitive and visually appealing app interfaces'],
                ['title' => 'Development & Testing', 'description' => 'Building and testing the app across different devices'],
                ['title' => 'Launch & Optimization', 'description' => 'Publishing to app stores and ongoing performance optimization']
            ],
            'technologies' => ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'TestFlight']
        ]);

        Service::create([
            'title' => 'Cloud Solutions',
            'slug' => 'cloud-solutions',
            'excerpt' => 'Scalable cloud infrastructure and migration',
            'content' => '<p>Transform your business with cloud technology. We help you migrate, optimize, and manage your infrastructure on AWS, Azure, and Google Cloud.</p>',
            'icon' => 'Cloud',
            'status' => 'published',
            'sort_order' => 3,
            'features' => [
                'Cloud migration and infrastructure setup',
                'Auto-scaling and load balancing',
                'Serverless architecture implementation',
                'Cloud security and compliance',
                'Cost optimization and monitoring',
                'Disaster recovery and backup solutions'
            ],
            'benefits' => [
                'Reduced infrastructure costs',
                'Improved scalability and flexibility',
                'Enhanced security and compliance',
                'Better disaster recovery capabilities',
                'Improved performance and reliability'
            ],
            'process_steps' => [
                ['title' => 'Assessment & Planning', 'description' => 'Evaluating current infrastructure and cloud migration strategy'],
                ['title' => 'Migration & Setup', 'description' => 'Migrating applications and setting up cloud infrastructure'],
                ['title' => 'Optimization', 'description' => 'Fine-tuning performance and optimizing costs'],
                ['title' => 'Monitoring & Support', 'description' => 'Ongoing monitoring, maintenance, and support']
            ],
            'technologies' => ['AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Docker', 'Terraform']
        ]);

        Service::create([
            'title' => 'DevOps & CI/CD',
            'slug' => 'devops-cicd',
            'excerpt' => 'Automated deployment pipelines and infrastructure',
            'content' => '<p>Streamline your development workflow with modern DevOps practices. We implement CI/CD pipelines, containerization, and infrastructure as code.</p>',
            'icon' => 'GitBranch',
            'status' => 'published',
            'sort_order' => 4,
            'features' => [
                'CI/CD pipeline setup and automation',
                'Infrastructure as Code (IaC)',
                'Container orchestration with Kubernetes',
                'Monitoring and alerting systems',
                'Security scanning and compliance',
                'Performance optimization and scaling'
            ],
            'benefits' => [
                'Faster and more reliable deployments',
                'Reduced manual errors and downtime',
                'Improved collaboration between teams',
                'Better security and compliance',
                'Increased deployment frequency'
            ],
            'process_steps' => [
                ['title' => 'Current State Analysis', 'description' => 'Assessing existing development and deployment processes'],
                ['title' => 'Pipeline Design', 'description' => 'Designing automated CI/CD pipelines and infrastructure'],
                ['title' => 'Implementation', 'description' => 'Setting up automation tools and monitoring systems'],
                ['title' => 'Training & Handover', 'description' => 'Training your team and establishing best practices']
            ],
            'technologies' => ['Jenkins', 'GitLab CI', 'Docker', 'Kubernetes', 'Terraform', 'Prometheus']
        ]);

        Service::create([
            'title' => 'UI/UX Design',
            'slug' => 'ui-ux-design',
            'excerpt' => 'Beautiful and intuitive user interfaces',
            'content' => '<p>Design exceptional user experiences that delight your customers. Our designers create beautiful, accessible, and conversion-focused interfaces.</p>',
            'icon' => 'Palette',
            'status' => 'published',
            'sort_order' => 5,
            'features' => [
                'User research and persona development',
                'Wireframing and prototyping',
                'Visual design and branding',
                'Usability testing and optimization',
                'Accessibility compliance (WCAG)',
                'Design system creation'
            ],
            'benefits' => [
                'Improved user satisfaction and engagement',
                'Higher conversion rates',
                'Reduced support costs',
                'Stronger brand perception',
                'Better accessibility and inclusivity'
            ],
            'process_steps' => [
                ['title' => 'Research & Discovery', 'description' => 'Understanding users, business goals, and market context'],
                ['title' => 'Design & Prototyping', 'description' => 'Creating wireframes, mockups, and interactive prototypes'],
                ['title' => 'Testing & Validation', 'description' => 'User testing and iterative design improvements'],
                ['title' => 'Implementation Support', 'description' => 'Supporting development team with design implementation']
            ],
            'technologies' => ['Figma', 'Adobe XD', 'Sketch', 'Principle', 'InVision', 'Zeplin']
        ]);

        Service::create([
            'title' => 'Data Analytics',
            'slug' => 'data-analytics',
            'excerpt' => 'Turn your data into actionable insights',
            'content' => '<p>Unlock the power of your data with advanced analytics. We help you collect, process, and visualize data to make informed business decisions.</p>',
            'icon' => 'BarChart',
            'status' => 'published',
            'sort_order' => 6,
            'features' => [
                'Data collection and ETL pipelines',
                'Advanced analytics and machine learning',
                'Interactive dashboards and visualization',
                'Real-time data processing',
                'Predictive analytics and insights',
                'Data governance and security'
            ],
            'benefits' => [
                'Data-driven decision making',
                'Improved operational efficiency',
                'Better customer understanding',
                'Competitive advantage through insights',
                'Automated reporting and monitoring'
            ],
            'process_steps' => [
                ['title' => 'Data Assessment', 'description' => 'Evaluating data sources, quality, and business requirements'],
                ['title' => 'Infrastructure Setup', 'description' => 'Building data pipelines and analytics infrastructure'],
                ['title' => 'Analysis & Modeling', 'description' => 'Developing analytics models and generating insights'],
                ['title' => 'Visualization & Deployment', 'description' => 'Creating dashboards and deploying analytics solutions']
            ],
            'technologies' => ['Python', 'R', 'TensorFlow', 'Tableau', 'Power BI', 'Apache Spark']
        ]);

        // AI Services
        AIService::create([
            'title' => 'AI Chatbots',
            'slug' => 'ai-chatbots',
            'description' => 'Intelligent conversational AI for customer support',
            'content' => '<p>Build smart chatbots powered by advanced NLP and machine learning to automate customer support and engagement.</p>',
            'icon' => 'MessageSquare',
            'status' => 'published',
            'sort_order' => 1,
        ]);

        AIService::create([
            'title' => 'Computer Vision',
            'slug' => 'computer-vision',
            'description' => 'Image recognition and analysis solutions',
            'content' => '<p>Implement computer vision systems for object detection, face recognition, OCR, and more using state-of-the-art deep learning models.</p>',
            'icon' => 'Eye',
            'status' => 'published',
            'sort_order' => 2,
        ]);

        AIService::create([
            'title' => 'Predictive Analytics',
            'slug' => 'predictive-analytics',
            'description' => 'ML models for forecasting and predictions',
            'content' => '<p>Use machine learning to predict future trends, customer behavior, and business outcomes with high accuracy.</p>',
            'icon' => 'TrendingUp',
            'status' => 'published',
            'sort_order' => 3,
        ]);

        AIService::create([
            'title' => 'Natural Language Processing',
            'slug' => 'nlp',
            'description' => 'Text analysis and language understanding',
            'content' => '<p>Extract insights from text data with NLP solutions including sentiment analysis, entity recognition, and text classification.</p>',
            'icon' => 'FileText',
            'status' => 'published',
            'sort_order' => 4,
        ]);

        // Blogs
        Blog::create([
            'user_id' => 1,
            'title' => 'The Future of Web Development in 2026',
            'slug' => 'future-of-web-development-2026',
            'excerpt' => 'Exploring emerging trends and technologies shaping the web development landscape',
            'content' => '<p>The web development industry continues to evolve at a rapid pace. In this article, we explore the key trends that will define web development in 2026 and beyond.</p><p>From server-side rendering to edge computing, the future is bright and full of possibilities.</p>',
            'category' => 'Technology',
            'tags' => ['web development', 'trends', 'technology'],
            'views' => 1250,
            'status' => 'published',
            'published_at' => now()->subDays(5),
        ]);

        Blog::create([
            'user_id' => 1,
            'title' => 'Building Scalable Cloud Applications',
            'slug' => 'building-scalable-cloud-applications',
            'excerpt' => 'Best practices for designing and deploying cloud-native applications',
            'content' => '<p>Learn how to build applications that can scale effortlessly in the cloud. We cover architecture patterns, database strategies, and deployment techniques.</p>',
            'category' => 'Cloud Computing',
            'tags' => ['cloud', 'scalability', 'architecture'],
            'views' => 890,
            'status' => 'published',
            'published_at' => now()->subDays(10),
        ]);

        Blog::create([
            'user_id' => 1,
            'title' => 'AI and Machine Learning in Business',
            'slug' => 'ai-ml-in-business',
            'excerpt' => 'How AI is transforming industries and creating new opportunities',
            'content' => '<p>Artificial Intelligence and Machine Learning are no longer buzzwords – they are essential tools for modern businesses. Discover how to leverage AI for competitive advantage.</p>',
            'category' => 'Artificial Intelligence',
            'tags' => ['ai', 'machine learning', 'business'],
            'views' => 1540,
            'status' => 'published',
            'published_at' => now()->subDays(15),
        ]);

        // FAQs
        FAQ::create([
            'question' => 'What services do you offer?',
            'answer' => 'We offer a comprehensive range of services including web development, mobile app development, cloud solutions, DevOps, UI/UX design, data analytics, and AI/ML solutions.',
            'category' => 'Services',
            'status' => 'published',
            'sort_order' => 1,
        ]);

        FAQ::create([
            'question' => 'How long does a typical project take?',
            'answer' => 'Project timelines vary depending on scope and complexity. A simple website might take 4-6 weeks, while a complex enterprise application could take 3-6 months. We provide detailed timelines during the planning phase.',
            'category' => 'General',
            'status' => 'published',
            'sort_order' => 2,
        ]);

        FAQ::create([
            'question' => 'Do you provide ongoing support and maintenance?',
            'answer' => 'Yes! We offer comprehensive support and maintenance packages to keep your applications running smoothly, secure, and up-to-date.',
            'category' => 'Support',
            'status' => 'published',
            'sort_order' => 3,
        ]);

        FAQ::create([
            'question' => 'What technologies do you specialize in?',
            'answer' => 'We specialize in modern technologies including React, Laravel, Node.js, Python, PostgreSQL, MySQL, AWS, Docker, Kubernetes, and various AI/ML frameworks.',
            'category' => 'Technical',
            'status' => 'published',
            'sort_order' => 4,
        ]);

        // Team Members
        TeamMember::create([
            'name' => 'Sarah Johnson',
            'position' => 'CEO & Founder',
            'bio' => 'Visionary leader with 15+ years of experience in technology and business strategy.',
            'email' => 'sarah@macro.com',
            'status' => 'active',
            'sort_order' => 1,
        ]);

        TeamMember::create([
            'name' => 'Michael Chen',
            'position' => 'CTO',
            'bio' => 'Technical expert specializing in cloud architecture and AI solutions.',
            'email' => 'michael@macro.com',
            'status' => 'active',
            'sort_order' => 2,
        ]);

        TeamMember::create([
            'name' => 'Emma Williams',
            'position' => 'Head of Design',
            'bio' => 'Award-winning designer creating beautiful and functional user experiences.',
            'email' => 'emma@macro.com',
            'status' => 'active',
            'sort_order' => 3,
        ]);

        TeamMember::create([
            'name' => 'David Rodriguez',
            'position' => 'Lead Developer',
            'bio' => 'Full-stack developer passionate about building scalable applications.',
            'email' => 'david@macro.com',
            'status' => 'active',
            'sort_order' => 4,
        ]);

        // Careers
        Career::create([
            'title' => 'Senior Full Stack Developer',
            'slug' => 'senior-full-stack-developer',
            'department' => 'Engineering',
            'location' => 'Remote',
            'type' => 'full-time',
            'description' => '<p>We are looking for an experienced Full Stack Developer to join our growing team. You will work on exciting projects using modern technologies.</p>',
            'requirements' => '<ul><li>5+ years of experience with React and Laravel</li><li>Strong understanding of databases and APIs</li><li>Experience with cloud platforms (AWS/Azure)</li><li>Excellent problem-solving skills</li></ul>',
            'salary_range' => '$80,000 - $120,000',
            'status' => 'open',
            'deadline' => now()->addMonths(2),
        ]);

        Career::create([
            'title' => 'UI/UX Designer',
            'slug' => 'ui-ux-designer',
            'department' => 'Design',
            'location' => 'London, UK',
            'type' => 'full-time',
            'description' => '<p>Join our design team to create beautiful and intuitive user experiences for web and mobile applications.</p>',
            'requirements' => '<ul><li>3+ years of UI/UX design experience</li><li>Proficiency in Figma and Adobe Creative Suite</li><li>Strong portfolio demonstrating design skills</li><li>Understanding of accessibility and usability principles</li></ul>',
            'salary_range' => '$60,000 - $85,000',
            'status' => 'open',
            'deadline' => now()->addMonths(1),
        ]);

        // Leads
        Lead::create([
            'name' => 'Tech Startup Inc',
            'email' => 'hello@techstartup.com',
            'phone' => '+1234567890',
            'company' => 'Tech Startup Inc',
            'subject' => 'Mobile App Development',
            'message' => 'We need help building a mobile app for our SaaS platform.',
            'source' => 'website',
            'status' => 'new',
            'assigned_to' => 1,
        ]);

        Lead::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'phone' => '+9876543210',
            'company' => 'E-commerce Co',
            'subject' => 'Cloud Migration',
            'message' => 'Looking to migrate our infrastructure to AWS.',
            'source' => 'website',
            'status' => 'contacted',
            'assigned_to' => 1,
        ]);

        // Pages
        Page::create([
            'title' => 'About Us',
            'slug' => 'about',
            'content' => '<h2>Welcome to MACRO Solutions Tools Ltd</h2><p>We are a leading technology company specializing in innovative software solutions, AI services, and digital transformation.</p><p>Our mission is to empower businesses with cutting-edge technology that drives growth and efficiency.</p><h3>Our Values</h3><ul><li>Innovation</li><li>Excellence</li><li>Integrity</li><li>Customer Success</li></ul>',
            'meta_title' => 'About MACRO Solutions',
            'meta_description' => 'Learn about MACRO Solutions - a leading technology company specializing in software development and AI services.',
            'status' => 'published',
        ]);

        // Finance Module
        $this->call(FinanceSeeder::class);

        // HR Module
        $this->call(HRSeeder::class);

        // Settings
        Setting::create(['key' => 'company_name', 'value' => 'MACRO Solutions Tools Ltd', 'type' => 'text', 'group' => 'general']);
        Setting::create(['key' => 'company_email', 'value' => 'hello@macro.com', 'type' => 'email', 'group' => 'contact']);
        Setting::create(['key' => 'company_phone', 'value' => '+44 20 1234 5678', 'type' => 'text', 'group' => 'contact']);
        Setting::create(['key' => 'company_address', 'value' => '123 Tech Street, London, UK', 'type' => 'text', 'group' => 'contact']);
        Setting::create(['key' => 'footer_text', 'value' => '© 2026 MACRO Solutions Tools Ltd. All rights reserved.', 'type' => 'text', 'group' => 'general']);
    }
}
