import type { Registrant } from "../libs/Registrant";

//5
interface UserRegisterCardProps {
  registrant: Registrant;
}

const itemLabels: Record<string, string> = {
  bottle: "Bottle 🍼",
  shoes: "Shoes 👟",
  cap: "Cap 🧢",
};

export default function UserRegisterCard({
  registrant,
}: UserRegisterCardProps) {
  // registrant.gender === "male"   -> "👨 Male"
  //registrant.gender === "female" -> "👩 Female"
  const genderText = registrant.gender === "male" ? "👨 Male" : "👩 Female";

  return (
    <div className="card p-3 my-2 shadow-sm text-start">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h5 className="mb-1 fw-bold">{registrant.fullName}</h5>
          <div className="text-secondary small mb-2">
            {registrant.plan} · {genderText}
          </div>

          <div className="d-flex gap-2 flex-wrap">
            {registrant.extraItems?.map((itemId) => (
              <span
                key={itemId}
                className="badge bg-light text-dark border fw-bold px-2 py-1"
              >
                {itemLabels[itemId]}
              </span>
            ))}
          </div>
        </div>

        <div className="fs-5">{registrant.total.toLocaleString()} THB</div>
      </div>
    </div>
  );
}
