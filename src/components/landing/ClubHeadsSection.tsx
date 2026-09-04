const heads = [
  { name: "R Kishore", position: "President", bio: "Third year BCA student, AI/ML enthusiast." },
  { name: "Pratheek D", position: "Vice President", bio: "Third year BCA student, Full-stack developer." },
  { name: "Harsh S Shah", position: "Tech Lead", bio: "Third year BCA student, open-source contributor." },
  {name:"Jyothi K", position:"Head", bio:"Third year BCA student, Event Head."},
  {name:"Leena Soni", position:"Head", bio:"Third year BCA student, Event Head."},
];

const ClubHeadsSection = () => (
  <section className="py-24 border-t">
    <div className="container mx-auto px-4">
      <p className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Team</p>
      <h2 className="text-3xl sm:text-4xl font-bold mb-12">Club Heads</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {heads.map((h) => (
          <div key={h.name} className="border rounded-lg p-6">
            {/* <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-mono text-lg font-bold text-muted-foreground">
                {h.name.split(" ").map(n => n[0]).join("")}
              </span>
            </div> */}
            <h3 className="font-mono text-sm font-semibold">{h.name}</h3>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mt-1">{h.position}</p>
            <p className="text-sm text-muted-foreground mt-3">{h.bio}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ClubHeadsSection;
