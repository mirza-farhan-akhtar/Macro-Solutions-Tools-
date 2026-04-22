<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'MACRO Solutions API',
        'version' => '1.0',
        'status' => 'active'
    ]);
});


