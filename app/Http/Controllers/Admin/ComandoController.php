<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Console\Kernel as ConsoleKernel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\Console\Input\StringInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Throwable;

class ComandoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Comandos/Index', [
            'prontos' => config('comandos.prontos', []),
            'bloqueados' => config('comandos.bloqueados', []),
            'resultado' => session('resultado'),
        ]);
    }

    public function executar(Request $request): RedirectResponse
    {
        $dados = $request->validate([
            'comando' => ['required', 'string', 'max:200'],
        ], [
            'comando.required' => 'Informe o comando.',
            'comando.max' => 'O comando é longo demais.',
        ]);

        $comando = trim($dados['comando']);
        $nome = $this->nomeDoComando($comando);

        if ($nome === '') {
            return back()->withErrors(['comando' => 'Informe o comando.']);
        }

        if ($this->estaBloqueado($nome)) {
            return back()->withErrors([
                'comando' => "O comando \"{$nome}\" não pode ser executado pelo painel.",
            ]);
        }

        if (! array_key_exists($nome, Artisan::all())) {
            return back()->withErrors([
                'comando' => "O comando \"{$nome}\" não existe.",
            ]);
        }

        set_time_limit(120);

        $output = new BufferedOutput;
        $input = new StringInput($comando);
        $input->setInteractive(false);

        $inicio = hrtime(true);
        $exitCode = 1;
        $saida = '';

        try {
            $kernel = app(ConsoleKernel::class);
            $exitCode = $kernel->handle($input, $output);
            $kernel->terminate($input, $exitCode);
            $saida = $output->fetch();
        } catch (Throwable $e) {
            Log::error('Falha ao executar comando artisan pelo painel', [
                'user_id' => $request->user('web')?->id,
                'comando' => $comando,
                'erro' => $e->getMessage(),
            ]);

            return back()->withErrors([
                'comando' => 'Falha ao executar: '.$e->getMessage(),
            ]);
        }

        $duracaoMs = (int) round((hrtime(true) - $inicio) / 1_000_000);

        Log::info('Comando artisan executado pelo painel', [
            'user_id' => $request->user('web')?->id,
            'comando' => $comando,
            'exit_code' => $exitCode,
            'duracao_ms' => $duracaoMs,
        ]);

        return redirect()
            ->route('admin.comandos.index')
            ->with('resultado', [
                'comando' => $comando,
                'exit_code' => $exitCode,
                'saida' => $saida !== '' ? $saida : '(sem saída)',
                'duracao_ms' => $duracaoMs,
                'executado_em' => now()->format('d/m/Y H:i:s'),
            ]);
    }

    private function nomeDoComando(string $comando): string
    {
        $token = strtok($comando, " \t");

        return is_string($token) ? $token : '';
    }

    private function estaBloqueado(string $nome): bool
    {
        if (str_starts_with($nome, 'make:')) {
            return true;
        }

        return in_array($nome, config('comandos.bloqueados', []), true);
    }
}
