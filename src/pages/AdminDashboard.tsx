import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import { getAllClients } from "@/data/clientsData";
import { Building2, FileText, Target, ArrowRight, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const formatDate = (dateStr: string) => {
  const [, m, d] = dateStr.split("-");
  const months: Record<string, string> = {
    "01": "янв", "02": "фев", "03": "мар", "04": "апр",
    "05": "май", "06": "июн", "07": "июл", "08": "авг",
    "09": "сен", "10": "окт", "11": "ноя", "12": "дек",
  };
  return `${parseInt(d)} ${months[m] || m}`;
};

const AdminDashboard = () => {
  const clients = getAllClients();

  return (
    <Layout>
      <Seo title="Панель управления" path="/admin" noIndex />

      <section className="py-16 md:py-20 bg-primary">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">
            Golubev Consulting
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground tracking-tight leading-[1.08]">
            Панель управления
          </h1>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-foreground">Клиенты</h2>
            <a
              href={`${import.meta.env.VITE_ADMIN_API || ""}/admin`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Добавить данные
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="grid gap-4">
            {clients.map(({ client, protocols, goals }) => {
              const lastProtocol = [...protocols].sort((a, b) => b.date.localeCompare(a.date))[0];
              const lastGoal = [...goals].sort((a, b) => b.month.localeCompare(a.month))[0];

              return (
                <div
                  key={client.slug}
                  className="border border-border rounded-xl bg-card p-6 hover:border-accent/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent shrink-0">
                        <Building2 className="h-6 w-6" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground text-lg truncate">{client.name}</h3>
                        <p className="text-sm text-muted-foreground">{client.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{protocols.length} протокол{protocols.length === 1 ? "" : protocols.length < 5 ? "а" : "ов"}</span>
                        {lastProtocol && (
                          <span className="text-xs text-muted-foreground/60">
                            (посл. {formatDate(lastProtocol.date)})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <span>{goals.length} план{goals.length === 1 ? "" : goals.length < 5 ? "а" : "ов"}</span>
                      </div>
                    </div>

                    <Link to={`/client/${client.slug}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        Открыть
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}

            {clients.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                Клиентов пока нет
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
