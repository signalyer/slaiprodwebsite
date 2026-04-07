import { motion } from "framer-motion";

const nodeStyle = "flex items-center justify-center rounded-lg text-xs font-medium px-3 py-2 border";

const SoloDiagram = () => (
  <div className="flex flex-col items-center gap-3 py-4">
    {/* Data Sources */}
    <div className="flex gap-3">
      <div className={`${nodeStyle} bg-primary/10 border-primary/30 text-primary`}>Database</div>
      <div className={`${nodeStyle} bg-primary/10 border-primary/30 text-primary`}>APIs</div>
      <div className={`${nodeStyle} bg-primary/10 border-primary/30 text-primary`}>Documents</div>
    </div>
    <Arrow />
    <div className={`${nodeStyle} bg-accent/10 border-accent/30 text-accent`}>MCP Server</div>
    <Arrow />
    {/* Agent Loop */}
    <div className="relative border border-primary/30 rounded-xl p-4 bg-primary/5 w-full max-w-xs">
      <span className="absolute -top-3 left-4 text-[10px] font-mono text-primary bg-background px-2">SOLO AGENT</span>
      <div className="grid grid-cols-2 gap-2">
        <div className={`${nodeStyle} bg-card border-border text-foreground`}>Perceive</div>
        <div className={`${nodeStyle} bg-card border-border text-foreground`}>Reason</div>
        <div className={`${nodeStyle} bg-card border-border text-foreground`}>Act</div>
        <div className={`${nodeStyle} bg-card border-border text-foreground`}>Learn</div>
      </div>
    </div>
    <Arrow />
    <div className={`${nodeStyle} bg-secondary border-border text-foreground`}>Output</div>
  </div>
);

const CommandDiagram = () => (
  <div className="flex flex-col items-center gap-3 py-4">
    <div className="flex gap-3">
      <div className={`${nodeStyle} bg-primary/10 border-primary/30 text-primary`}>Signals</div>
      <div className={`${nodeStyle} bg-primary/10 border-primary/30 text-primary`}>Data</div>
    </div>
    <Arrow />
    {/* Orchestrator */}
    <div className="relative border border-blue-500/30 rounded-xl p-4 bg-blue-500/5 w-full max-w-sm">
      <span className="absolute -top-3 left-4 text-[10px] font-mono text-blue-400 bg-background px-2">ORCHESTRATOR</span>
      <div className="flex gap-2 justify-center mb-3">
        <div className={`${nodeStyle} bg-card border-blue-500/30 text-blue-400`}>Research Agent</div>
        <div className={`${nodeStyle} bg-card border-blue-500/30 text-blue-400`}>Analysis Agent</div>
      </div>
      <div className="flex justify-center">
        <div className={`${nodeStyle} bg-card border-blue-500/30 text-blue-400`}>Execution Agent</div>
      </div>
    </div>
    <Arrow />
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-green-400" />
      <div className={`${nodeStyle} bg-green-500/10 border-green-500/30 text-green-400`}>Human Approval Gate</div>
    </div>
    <Arrow />
    <div className={`${nodeStyle} bg-secondary border-border text-foreground`}>Action</div>
  </div>
);

const RouterDiagram = () => (
  <div className="flex flex-col items-center gap-3 py-4">
    <div className={`${nodeStyle} bg-primary/10 border-primary/30 text-primary`}>Incoming Signal</div>
    <Arrow />
    <div className="relative border border-purple-500/30 rounded-xl p-3 bg-purple-500/5 w-full max-w-xs">
      <span className="absolute -top-3 left-4 text-[10px] font-mono text-purple-400 bg-background px-2">INTENT CLASSIFIER</span>
      <div className="text-center text-xs text-muted-foreground pt-2">Classifies by type, complexity & risk</div>
    </div>
    <div className="flex gap-4 items-start">
      <div className="flex flex-col items-center gap-2">
        <Arrow />
        <div className={`${nodeStyle} bg-primary/10 border-primary/30 text-primary text-[11px]`}>Simple</div>
        <div className="text-[10px] text-muted-foreground">Solo Agent</div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Arrow />
        <div className={`${nodeStyle} bg-blue-500/10 border-blue-500/30 text-blue-400 text-[11px]`}>Complex</div>
        <div className="text-[10px] text-muted-foreground">Multi-Agent</div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Arrow />
        <div className={`${nodeStyle} bg-purple-500/10 border-purple-500/30 text-purple-400 text-[11px]`}>Critical</div>
        <div className="text-[10px] text-muted-foreground">Full + HITL</div>
      </div>
    </div>
  </div>
);

const Arrow = () => (
  <div className="flex flex-col items-center">
    <div className="w-px h-4 bg-border" />
    <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-border" />
  </div>
);

export { SoloDiagram, CommandDiagram, RouterDiagram };
