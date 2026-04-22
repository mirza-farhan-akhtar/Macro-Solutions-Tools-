<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Allow: traditional admin, super-admin via RBAC, or any user with at least one RBAC role
        // Fine-grained access is controlled by check.permission middleware on individual routes
        if ($user->isAdmin() || $user->isSuperAdmin() || $user->roles()->count() > 0) {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized. You need a role to access this area.'], 403);
    }
}
