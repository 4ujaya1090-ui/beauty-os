import MainLayout from "../../../../layouts/MainLayout/MainLayout";

import ProcedureCard from "../../components/ProcedureCard/ProcedureCard";

import { procedures } from "../../data/procedures";

import "./ProceduresPage.css";

function ProceduresPage() {
  return (
    <MainLayout>

      

      <div className="procedures-page">

        {procedures.map((procedure) => (

          <ProcedureCard
            key={procedure.id}
            name={procedure.name}
            duration={procedure.duration}
            price={procedure.price}
          />

        ))}

      </div>

    </MainLayout>
  );
}

export default ProceduresPage;