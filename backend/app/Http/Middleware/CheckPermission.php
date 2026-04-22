<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        // Super admin and traditional admin bypass all permission checks
        if ($request->user()->isSuperAdmin() || $request->user()->isAdmin()) {
            return $next($request);
        }

        // Handle multiple permissions separated by | (OR logic)
        $permissions = explode('|', $permission);
        $hasPermission = false;
        
        foreach ($permissions as $perm) {
            if ($request->user()->hasPermission(trim($perm))) {
                $hasPermission = true;
                break;
            }
        }

        if (!$hasPermission) {
            return response()->json([
                'message' => 'You do not have permission to perform this action.',
                'required_permission' => $permission
            ], 403);
        }

        return $next($request);
    }
}
