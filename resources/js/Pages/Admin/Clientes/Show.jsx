import { Head, Link } from '@inertiajs/react';
import { RecycleIcon, ShoppingBagIcon } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import Extrato from '@/Components/Extrato';
import { CartaoSaldo } from '@/Components/admin/CartaoSaldo';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { formatTelefone } from '@/lib/format';

export default function Show({ cliente, transacoes }) {
    return (
        <AdminLayout title={cliente.nome}>
            <Head title={cliente.nome} />
            <div className="mb-6">
                <Button asChild variant="outline">
                    <Link href="/admin/clientes">← Voltar</Link>
                </Button>
            </div>

            <div className="mb-8 grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Dados do cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        <p>
                            <span className="text-muted-foreground">WhatsApp: </span>
                            {formatTelefone(cliente.telefone)}
                        </p>
                        {cliente.cidade && (
                            <p>
                                <span className="text-muted-foreground">Cidade: </span>
                                {cliente.cidade}
                            </p>
                        )}
                        {cliente.idade != null && (
                            <p>
                                <span className="text-muted-foreground">Idade: </span>
                                {cliente.idade}
                            </p>
                        )}
                        {cliente.genero_label && (
                            <p>
                                <span className="text-muted-foreground">Gênero: </span>
                                {cliente.genero_label}
                            </p>
                        )}
                    </CardContent>
                </Card>
                <CartaoSaldo saldo={cliente.saldo} />
            </div>

            <div className="mb-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="min-h-12 px-6 text-base">
                    <Link href={`/admin/receber?cliente=${cliente.id}`}>
                        <RecycleIcon className="size-5" />
                        Receber recicláveis
                    </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="min-h-12 px-6 text-base">
                    <Link href={`/admin/vender?cliente=${cliente.id}`}>
                        <ShoppingBagIcon className="size-5" />
                        Vender produtos
                    </Link>
                </Button>
            </div>

            <h2 className="mb-3 text-xl font-semibold">Extrato</h2>
            <Extrato transacoes={transacoes} />
        </AdminLayout>
    );
}
