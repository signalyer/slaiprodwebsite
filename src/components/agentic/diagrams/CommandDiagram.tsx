import commandImg from "@/assets/diagram-command-center.jpg";

const CommandDiagram = () => (
  <img
    src={commandImg}
    alt="Command Center architecture: a central orchestrator coordinating Research, Analysis and Execution agents with human approval gates"
    className="w-full max-w-md mx-auto rounded-lg"
  />
);

export default CommandDiagram;
