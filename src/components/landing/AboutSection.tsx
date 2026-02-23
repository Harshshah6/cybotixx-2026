import { Trophy, Users, Lightbulb } from "lucide-react";

const features = [
  // { icon: Code, title: "Hackathons", desc: "Build real projects in intense 24-48hr sprints" },
  { icon: Trophy, title: "Contests", desc: "Compete and sharpen your skills" },
  { icon: Users, title: "Workshops", desc: "Hands-on sessions on trending technologies" },
  { icon: Lightbulb, title: "Tech Talks", desc: "Learn from industry professionals and peers" },
];

const AboutSection = () => (
  <section id="about" className="py-24 border-t">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mb-16">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">About</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">What is Cybotixx?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Cybotixx is the official tech forum of the BCA department. Our mission is to bridge the gap between academics and industry by creating a space where students learn, build, and grow together.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="border rounded-lg p-6 hover:bg-muted/50 transition-colors group"
          >
            <f.icon size={20} className="text-muted-foreground mb-4 group-hover:text-foreground transition-colors" />
            <h3 className="font-mono text-sm font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
