import { Card } from "@/components/ui/Card";

interface DetailCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function DetailCard({ title, icon, children }: DetailCardProps) {
  return (
    <Card className="group p-6 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children}
        </div>
      </div>
    </Card>
  );
}

interface DetailItemProps {
  label: string;
  value: any;
  type?: "text" | "money" | "date" | "number";
}

export function DetailItem({ label, value, type = "text" }: DetailItemProps) {
  const formatValue = () => {
    if (value == null || value === "") return "—";
    
    switch (type) {
      case "money":
        return new Intl.NumberFormat("en-AU", { 
          style: "currency", 
          currency: "AUD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case "date":
        return new Date(value).toLocaleDateString();
      case "number":
        return value.toString();
      default:
        return value;
    }
  };

  const getValueColor = () => {
    if (value == null || value === "") return "text-gray-400";
    if (type === "money") return "text-green-700 font-bold";
    return "text-gray-900";
  };

  return (
    <div className="group/item p-4 rounded-lg bg-gradient-to-r from-gray-50/50 to-white hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 border border-transparent hover:border-blue-200/50">
      <div className="space-y-2">
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</div>
        <div className={`text-base font-semibold ${getValueColor()} transition-colors duration-200`}>
          {formatValue()}
        </div>
      </div>
    </div>
  );
}
