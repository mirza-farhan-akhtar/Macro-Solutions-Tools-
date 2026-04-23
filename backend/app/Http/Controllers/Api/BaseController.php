<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class BaseController extends Controller
{
    /**
     * Authorize a single permission
     */
    protected function authorize(string $permission): void
    {
        $user = Auth::user();
        if (!$user) {
            abort(401, 'Unauthorized');
        }

        // Super admin always has access
        if ($user->isSuperAdmin()) {
            return;
        }

        // Check if user has the permission
        if (!$user->hasPermission($permission)) {
            abort(403, "You do not have permission: {$permission}");
        }
    }

    /**
     * Authorize at least one of the permissions
     */
    protected function authorizeAtLeast(array $permissions): void
    {
        $user = Auth::user();
        if (!$user) {
            abort(401, 'Unauthorized');
        }

        // Super admin always has access
        if ($user->isSuperAdmin()) {
            return;
        }

        // Check if user has at least one of the permissions
        foreach ($permissions as $permission) {
            if ($user->hasPermission($permission)) {
                return;
            }
        }

        abort(403, 'You do not have required permissions');
    }

    /**
     * Send a successful response
     */
    protected function respond(array $data, string $message = '', int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            ...$data
        ], $statusCode);
    }

    /**
     * Send a created response
     */
    protected function respondCreated(array $data, string $message = ''): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            ...$data
        ], 201);
    }

    /**
     * Send a paginated response
     */
    protected function respondWithPagination(LengthAwarePaginator $paginator): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $paginator->items(),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ]
        ], 200);
    }

    /**
     * Send an error response
     */
    protected function respondError(string $message, int $statusCode = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], $statusCode);
    }

    /**
     * Send validation error response
     */
    protected function respondValidationError(array $errors): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $errors
        ], 422);
    }
}
