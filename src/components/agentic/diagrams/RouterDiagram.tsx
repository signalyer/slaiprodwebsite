import routerImg from "@/assets/diagram-smart-router.jpg";

const RouterDiagram = () => (
  <img
    src={routerImg}
    alt="Smart Router architecture: an intent classifier routing incoming signals to pipelines of varying complexity, from simple solo agents to full hierarchical teams with human approval"
    className="w-full max-w-md mx-auto rounded-lg"
  />
);

export default RouterDiagram;
