<?php

use App\Http\Controllers\Api\AboutMeController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\ShowController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\StatsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/ping', fn () => response()->json(['ok' => true]));


Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('/projects', ProjectController::class);
    Route::apiResource('/skills', SkillController::class);
    Route::apiResource('/experiences', ExperienceController::class);
    Route::apiResource('/aboutmes', AboutMeController::class);
    Route::apiResource('/settings', SettingController::class);
    Route::post('/messages/{id}/reply', [MessageController::class, 'reply']);
    Route::get('/dashboard-stats', [DashboardController::class, 'index']);
});

Route::post('/login', [AuthController::class, 'login']);

Route::get('/fetch_about_me', [ShowController::class, 'fetch_about_me']);
Route::get('/fetch_projects', [ShowController::class, 'index']);
Route::get('/fetch_featured_projects', [ShowController::class, 'fetch_featured_projects']);
Route::get('/publicSkills', [ShowController::class, 'publicSkills']);
Route::get('/fetch_experiences', [ShowController::class, 'experiences']);
Route::post('/projects/{project}/view', [ShowController::class, 'incrementView']);

Route::get('/analytics/total-views', [AnalyticsController::class, 'totalViews']);

Route::apiResource('/messages', MessageController::class);

Route::get('/fetch_settings', [SettingController::class, 'index']);

Route::get('/stats', [StatsController::class, 'index']);