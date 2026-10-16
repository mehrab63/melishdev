import {
  Globe,
  AppWindow,
  Smartphone,
  Network,
  KeyRound,
  Package,
  ShoppingBag,
  Radio,
  Database,
  ArrowDown,
  Layers,
} from "lucide-react";
import { getContent } from "@/content";
import type { Locale } from "@/lib/i18n";
export function Architecture({
  locale,
  compact = false,
}: {
  locale: Locale;
  compact?: boolean;
}) {
  const c = getContent(locale);
  const fa = locale === "fa";
  return (
    <figure
      className={"architecture" + (compact ? " architecture-compact" : "")}
      aria-label={
        fa
          ? "معماری کلاینت، درگاه API، سرویس‌ها، ارتباطات و پایگاه داده"
          : "Architecture from clients through the gateway, services, messaging and databases"
      }
    >
      <div className="diagram-topline">
        <span>
          <span className="technical-dot" />{" "}
          {fa ? "معماری توزیع‌شده" : "DISTRIBUTED BY DESIGN"}
        </span>
        <Layers size={15} />
      </div>
      <div className="diagram-stage">
        <span className="diagram-layer">01</span>
        <div className="diagram-client">
          <Globe size={16} />
          <bdi>Web</bdi>
        </div>
        <div className="diagram-client">
          <Smartphone size={16} />
          <bdi>PWA</bdi>
        </div>
        <div className="diagram-client">
          <AppWindow size={16} />
          <bdi>Client</bdi>
        </div>
      </div>
      <div className="diagram-connector" aria-hidden="true">
        <span />
        <ArrowDown size={13} />
      </div>
      <div className="diagram-gateway">
        <Network size={19} />
        <div>
          <strong>API Gateway</strong>
          <small>
            {fa
              ? "یک نقطه ورود، مرزهای روشن"
              : "One entry point. Clear boundaries."}
          </small>
        </div>
        <span className="gateway-badge">
          <bdi>HTTPS</bdi>
        </span>
      </div>
      <div className="diagram-fan" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="diagram-stage services-stage">
        <span className="diagram-layer">02</span>
        {[
          { icon: KeyRound, en: "Identity", fa: "هویت" },
          { icon: Package, en: "Product", fa: "محصول" },
          { icon: ShoppingBag, en: "Order", fa: "سفارش" },
        ].map(({ icon: Icon, en, fa: label }) => (
          <div className="diagram-service" key={en}>
            <Icon size={19} />
            <strong>{fa ? label : en}</strong>
            <small>
              <bdi>.NET</bdi>
            </small>
          </div>
        ))}
      </div>
      <div className="diagram-connector" aria-hidden="true">
        <span />
        <ArrowDown size={13} />
      </div>
      <div className="diagram-bus">
        <Radio size={16} />
        <bdi>RabbitMQ</bdi>
        <span>·</span>
        <bdi>MassTransit</bdi>
        <span className="bus-grpc">
          <bdi>gRPC</bdi>
        </span>
      </div>
      <div className="diagram-connector short" aria-hidden="true">
        <span />
      </div>
      <div className="diagram-stage database-stage">
        <span className="diagram-layer">03</span>
        {["Identity DB", "Product DB", "Order DB"].map((name) => (
          <div key={name}>
            <Database size={18} />
            <bdi>{name}</bdi>
          </div>
        ))}
      </div>
      <figcaption>{c.ui.schematic}</figcaption>
    </figure>
  );
}
