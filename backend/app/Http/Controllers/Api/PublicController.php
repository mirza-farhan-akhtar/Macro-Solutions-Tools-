<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\AIService;
use App\Models\Blog;
use App\Models\FAQ;
use App\Models\TeamMember;
use App\Models\Career;
use App\Models\Page;
use App\Models\Setting;
use App\Models\Lead;
use App\Models\Appointment;
use App\Models\Application;
use App\Models\ClientLogo;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function home()
    {
        return response()->json([
            'services' => Service::published()->orderBy('sort_order')->take(6)->get(),
            'blogs' => Blog::published()->latest()->take(3)->get(),
            'team' => TeamMember::active()->orderBy('sort_order')->take(4)->get(),
            'settings' => Setting::all()->pluck('value', 'key'),
            'client_logos' => ClientLogo::active()->ordered()->get(),
        ]);
    }

    public function about()
    {
        $page = Page::where('slug', 'about')->published()->first();
        
        if (!$page) {
            return response()->json(['message' => 'Page not found'], 404);
        }

        return response()->json($page);
    }

    public function services()
    {
        return response()->json(Service::published()->orderBy('sort_order')->get());
    }

    public function serviceDetail($slug)
    {
        $service = Service::where('slug', $slug)->published()->first();
        
        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        return response()->json($service);
    }

    public function aiServices()
    {
        return response()->json(AIService::published()->orderBy('sort_order')->get());
    }

    public function blogs(Request $request)
    {
        $query = Blog::published()->with('author');

        if ($request->category) {
            $query->where('category', $request->category);
        }

        return response()->json($query->latest()->paginate(12));
    }

    public function blogDetail($slug)
    {
        $blog = Blog::where('slug', $slug)->published()->with('author')->first();
        
        if (!$blog) {
            return response()->json(['message' => 'Blog not found'], 404);
        }

        $blog->increment('views');

        return response()->json($blog);
    }

    public function faqs()
    {
        return response()->json(FAQ::published()->orderBy('sort_order')->get());
    }

    public function team()
    {
        return response()->json(TeamMember::active()->orderBy('sort_order')->get());
    }

    public function careers()
    {
        return response()->json(Career::open()->latest()->get());
    }

    public function careerDetail($slug)
    {
        $career = Career::where('slug', $slug)->open()->first();
        
        if (!$career) {
            return response()->json(['message' => 'Career not found'], 404);
        }

        return response()->json($career);
    }

    public function page($slug)
    {
        $page = Page::where('slug', $slug)->published()->first();
        
        if (!$page) {
            return response()->json(['message' => 'Page not found'], 404);
        }

        return response()->json($page);
    }

    public function settings()
    {
        return response()->json(Setting::all()->pluck('value', 'key'));
    }

    public function contact(Request $request)
    {
        $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|email',
            'phone'        => 'required|string|max:30',
            'company'      => 'nullable|string|max:255',
            'subject'      => 'nullable|string|max:255',
            'message'      => 'required|string',
            'budget_range' => 'nullable|string|max:50',
            'industry'     => 'nullable|string|max:100',
            'timeline'     => 'nullable|string|max:100',
            'source'       => 'nullable|string|max:100',
        ]);

        // Build notes with extra context
        $notes = '';
        if ($request->timeline) $notes .= "Timeline: {$request->timeline}\n";

        $lead = Lead::create([
            'name'         => $request->name,
            'email'        => $request->email,
            'phone'        => $request->phone,
            'company'      => $request->company,
            'company_name' => $request->company,
            'subject'      => $request->subject ?: 'Project Enquiry',
            'message'      => $request->message,
            'budget_range' => $request->budget_range,
            'industry'     => $request->industry,
            'notes'        => $notes ?: null,
            'source'       => $request->source ?: 'website',
            'status'       => 'new',
            'lead_status'  => 'new',
        ]);

        return response()->json(['message' => 'Thank you! We will contact you soon.', 'lead' => $lead], 201);
    }

    public function apply(Request $request)
    {
        $request->validate([
            'career_id' => 'required|exists:careers,id',
            'applicant_name' => 'required|string|max:255',
            'applicant_email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'cover_letter' => 'nullable|string',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:5120', // max 5MB
        ]);

        $data = $request->all();
        
        // Handle file upload
        if ($request->hasFile('resume')) {
            $file = $request->file('resume');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('resumes', $filename, 'public');
            $data['resume'] = $path;
        }

        $application = Application::create($data);

        return response()->json(['message' => 'Application submitted successfully!', 'application' => $application], 201);
    }

    public function appointment(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'date' => 'required|date|after:today',
            'time' => 'required',
            'service' => 'nullable|string',
            'message' => 'nullable|string',
        ]);

        $appointment = Appointment::create($request->all());

        return response()->json(['message' => 'Appointment booked successfully!', 'appointment' => $appointment], 201);
    }

    public function search(Request $request)
    {
        $query = $request->get('q', '');
        
        if (empty($query)) {
            return response()->json([
                'services' => [],
                'blogs' => [],
                'careers' => [],
                'faqs' => []
            ]);
        }

        // Clean and prepare search terms
        $searchTerms = $this->prepareSearchTerms($query);
        
        // Search Services with enhanced algorithm
        $services = $this->searchServices($searchTerms, $query);
        
        // Search Blogs with enhanced algorithm
        $blogs = $this->searchBlogs($searchTerms, $query);
        
        // Search Careers with enhanced algorithm
        $careers = $this->searchCareers($searchTerms, $query);
        
        // Search FAQs with enhanced algorithm
        $faqs = $this->searchFAQs($searchTerms, $query);

        return response()->json([
            'query' => $query,
            'services' => $services,
            'blogs' => $blogs,
            'careers' => $careers,
            'faqs' => $faqs,
            'total' => $services->count() + $blogs->count() + $careers->count() + $faqs->count()
        ]);
    }

    /**
     * Prepare search terms for better matching
     */
    private function prepareSearchTerms($query)
    {
        // Remove special characters and convert to lowercase
        $cleaned = strtolower(trim(preg_replace('/[^\w\s]/', ' ', $query)));
        
        // Split into individual terms
        $terms = array_filter(explode(' ', $cleaned), function($term) {
            return strlen($term) > 2; // Only include terms longer than 2 characters
        });
        
        return array_unique($terms);
    }

    /**
     * Enhanced service search with relevance scoring
     */
    private function searchServices($searchTerms, $originalQuery)
    {
        $services = Service::published()
            ->select(['*'])
            ->where(function($q) use ($searchTerms, $originalQuery) {
                // Exact phrase match (highest priority)
                $q->where('title', 'like', "%{$originalQuery}%")
                  ->orWhere('excerpt', 'like', "%{$originalQuery}%")
                  ->orWhere('content', 'like', "%{$originalQuery}%");
                
                // Individual term matches
                foreach ($searchTerms as $term) {
                    $q->orWhere('title', 'like', "%{$term}%")
                      ->orWhere('excerpt', 'like', "%{$term}%")
                      ->orWhere('content', 'like', "%{$term}%")
                      ->orWhere('icon', 'like', "%{$term}%");
                }
            })
            ->take(8)
            ->get();

        return $services;
    }

    /**
     * Enhanced blog search with relevance scoring
     */
    private function searchBlogs($searchTerms, $originalQuery)
    {
        $blogs = Blog::published()
            ->select(['*'])
            ->where(function($q) use ($searchTerms, $originalQuery) {
                // Exact phrase match (highest priority)
                $q->where('title', 'like', "%{$originalQuery}%")
                  ->orWhere('excerpt', 'like', "%{$originalQuery}%")
                  ->orWhere('content', 'like', "%{$originalQuery}%")
                  ->orWhere('category', 'like', "%{$originalQuery}%");
                
                // Individual term matches
                foreach ($searchTerms as $term) {
                    $q->orWhere('title', 'like', "%{$term}%")
                      ->orWhere('excerpt', 'like', "%{$term}%")
                      ->orWhere('content', 'like', "%{$term}%")
                      ->orWhere('category', 'like', "%{$term}%")
                      ->orWhereJsonContains('tags', $term);
                }
            })
            ->take(8)
            ->get();

        return $blogs;
    }

    /**
     * Enhanced career search with relevance scoring
     */
    private function searchCareers($searchTerms, $originalQuery)
    {
        $careers = Career::whereIn('status', ['open', 'active'])
            ->select(['*'])
            ->where(function($q) use ($searchTerms, $originalQuery) {
                // Exact phrase match (highest priority)
                $q->where('title', 'like', "%{$originalQuery}%")
                  ->orWhere('description', 'like', "%{$originalQuery}%")
                  ->orWhere('department', 'like', "%{$originalQuery}%");
                
                // Individual term matches
                foreach ($searchTerms as $term) {
                    $q->orWhere('title', 'like', "%{$term}%")
                      ->orWhere('description', 'like', "%{$term}%")
                      ->orWhere('department', 'like', "%{$term}%")
                      ->orWhere('location', 'like', "%{$term}%")
                      ->orWhere('type', 'like', "%{$term}%")
                      ->orWhere('requirements', 'like', "%{$term}%")
                      ->orWhere('salary_range', 'like', "%{$term}%");
                }
            })
            ->take(8)
            ->get();

        return $careers;
    }

    /**
     * Enhanced FAQ search with relevance scoring
     */
    private function searchFAQs($searchTerms, $originalQuery)
    {
        $faqs = FAQ::where('status', 'published')
            ->select(['*'])
            ->where(function($q) use ($searchTerms, $originalQuery) {
                // Exact phrase match (highest priority)
                $q->where('question', 'like', "%{$originalQuery}%")
                  ->orWhere('answer', 'like', "%{$originalQuery}%");
                
                // Individual term matches
                foreach ($searchTerms as $term) {
                    $q->orWhere('question', 'like', "%{$term}%")
                      ->orWhere('answer', 'like', "%{$term}%")
                      ->orWhere('category', 'like', "%{$term}%");
                }
            })
            ->take(8)
            ->get();

        return $faqs;
    }
}
