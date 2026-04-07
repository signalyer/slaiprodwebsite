import soloImg from "@/assets/diagram-solo-expert.jpg";

const SoloDiagram = () => (
  <img
    src={soloImg}
    alt="Solo Expert architecture: a single AI agent in a feedback loop cycling through Perceive, Reason, Act and Learn phases, connected to data sources via MCP"
    className="w-full max-w-md mx-auto rounded-lg"
  />
);

export default SoloDiagram;
