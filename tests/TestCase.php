<?php

namespace Tests;

use App\Models\Tenant;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;

abstract class TestCase extends BaseTestCase
{
    protected $baseUrl = 'http://trin.localhost';

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'tenancy.database.central_connection' => config('database.default'),
            'tenancy.bootstrappers' => array_values(array_filter(
                config('tenancy.bootstrappers', []),
                fn (string $bootstrapper) => $bootstrapper !== \Stancl\Tenancy\Bootstrappers\DatabaseTenancyBootstrapper::class
            )),
        ]);

        if (! Schema::hasTable('tenants')) {
            $this->artisan('migrate', ['--path' => 'database/migrations', '--realpath' => false])->run();
        }

        if (! Schema::hasTable('users')) {
            $this->artisan('migrate', ['--path' => 'database/migrations/tenant', '--realpath' => false])->run();
        }

        if (class_exists(Tenant::class) && Schema::hasTable('tenants') && ! Tenant::query()->whereKey('trin')->exists()) {
            $tenant = Tenant::create(['id' => 'trin']);
            $tenant->domains()->create(['domain' => 'trin.localhost']);
        }

        URL::forceRootUrl('http://trin.localhost');
        $this->withServerVariables([
            'HTTP_HOST' => 'trin.localhost',
            'SERVER_NAME' => 'trin.localhost',
        ]);
    }

    public function call($method, $uri, $parameters = [], $cookies = [], $files = [], $server = [], $content = null)
    {
        if (is_string($uri) && str_starts_with($uri, '/')) {
            $uri = 'http://trin.localhost'.$uri;
        }

        return parent::call($method, $uri, $parameters, $cookies, $files, $server, $content);
    }

    protected function migrateFreshUsing()
    {
        return [
            '--drop-views' => false,
            '--drop-types' => false,
            '--path' => [
                'database/migrations',
                'database/migrations/tenant',
            ],
        ];
    }
}
