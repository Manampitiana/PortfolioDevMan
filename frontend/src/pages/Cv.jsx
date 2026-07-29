import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "../axios";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";

// 1. STYLES POUR LE PDF
const styles = StyleSheet.create({
  page: { padding: 32, backgroundColor: "#FFFFFF", fontFamily: "Helvetica" },

  // Header
  header: { flexDirection: "row", alignItems: "center", marginBottom: 14, paddingBottom: 14, borderBottom: "1pt solid #e5e7eb" },
  profileImg: { width: 68, height: 68, borderRadius: 34, marginRight: 16, border: "2pt solid #22d3ee" },
  name: { fontSize: 17, fontWeight: "bold", color: "#111827", marginBottom: 2 },
  jobTitle: { fontSize: 10, color: "#0891b2", fontWeight: "bold", textTransform: "uppercase", marginBottom: 6, letterSpacing: 0.5 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", columnGap: 14, rowGap: 3 },
  contactItem: { fontSize: 8, color: "#4b5563" },

  // Corps à 2 colonnes (hauteur libre, pas de fond fixe = pas de vide)
  body: { flexDirection: "row" },
  colLeft: { width: "31%", paddingRight: 14, borderRight: "1pt solid #e5e7eb" },
  colRight: { flex: 1, paddingLeft: 14 },

  sectionTitle: { fontSize: 10.5, fontWeight: "bold", color: "#111827", textTransform: "uppercase", marginBottom: 8, marginTop: 14 },
  sectionTitleFirst: { marginTop: 0 },

  // Éducation
  eduItem: { marginBottom: 9 },
  eduDegree: { fontSize: 9.5, fontWeight: "bold", color: "#1f2937" },
  eduSchool: { fontSize: 8.5, color: "#0891b2", marginTop: 1 },
  eduYear: { fontSize: 8, color: "#9ca3af", marginTop: 1 },

  // Listes à puces compactes (compétences / langues)
  bulletRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 4 },
  bulletDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: "#22d3ee", marginRight: 6, marginTop: 3.5 },
  bulletText: { fontSize: 8.5, color: "#374151" },

  // Profil / description
  paragraph: { fontSize: 9, color: "#4b5563", lineHeight: 1.5, textAlign: "justify" },

  // Expérience
  expItem: { marginBottom: 11 },
  expHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 },
  expTitle: { fontSize: 9.5, fontWeight: "bold", color: "#1f2937", flex: 1, paddingRight: 8 },
  expDate: { fontSize: 8, color: "#9ca3af" },
  expCompany: { fontSize: 8.5, color: "#0891b2", marginBottom: 4 },

  // Projets
  projItem: { marginBottom: 7 },
  projTitle: { fontSize: 9, fontWeight: "bold", color: "#1f2937", marginBottom: 1 },
});

// Découpe une description en points compacts (façon "bullet points") pour rester lisible sur 1 page
const toBullets = (text, max = 3) => {
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);
};

// 2. COMPOSANT DOCUMENT PDF
const MyCVDocument = ({ user, skills, experiences, projects, education, pdpBase64 }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      {/* HEADER */}
      <View style={styles.header}>
        {pdpBase64 && <Image src={pdpBase64} style={styles.profileImg} />}
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.jobTitle}>{user.job}</Text>
          <View style={styles.contactRow}>
            {user.email && <Text style={styles.contactItem}>{user.email}</Text>}
            {user.phone && <Text style={styles.contactItem}>{user.phone}</Text>}
            {user.location && <Text style={styles.contactItem}>{user.location}</Text>}
            {user.github_user && <Text style={styles.contactItem}>github.com/{user.github_user}</Text>}
          </View>
        </View>
      </View>

      {/* CORPS — 2 colonnes, hauteur libre */}
      <View style={styles.body}>

        {/* Colonne gauche */}
        <View style={styles.colLeft}>
          <Text style={[styles.sectionTitle, styles.sectionTitleFirst]}>Formation</Text>
          {education.map((edu, i) => (
            <View key={i} style={styles.eduItem}>
              <Text style={styles.eduDegree}>{edu.degree}</Text>
              <Text style={styles.eduSchool}>{edu.school}</Text>
              <Text style={styles.eduYear}>{edu.year}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Compétences</Text>
          {skills.map((skill, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{skill.name}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Langues</Text>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>Malgache — Maternel</Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>Français — Intermédiaire</Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>Anglais — Notions</Text>
          </View>
        </View>

        {/* Colonne droite */}
        <View style={styles.colRight}>
          <Text style={[styles.sectionTitle, styles.sectionTitleFirst]}>Profil</Text>
          <Text style={styles.paragraph}>{user.resume}</Text>

          <Text style={styles.sectionTitle}>Expérience</Text>
          {experiences.slice(0, 3).map((exp, i) => (
            <View key={i} style={styles.expItem}>
              <View style={styles.expHeader}>
                <Text style={styles.expTitle}>{exp.title}</Text>
                <Text style={styles.expDate}>{exp.date_range}</Text>
              </View>
              <Text style={styles.expCompany}>{exp.company}</Text>
              {toBullets(exp.description).map((line, j) => (
                <View key={j} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>{line}</Text>
                </View>
              ))}
            </View>
          ))}

          <Text style={styles.sectionTitle}>Projets Majeurs</Text>
          {projects.slice(0, 3).map((proj, i) => (
            <View key={i} style={styles.projItem}>
              <Text style={styles.projTitle}>{proj.title}</Text>
              <Text style={styles.bulletText}>{proj.short_description || proj.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

// 3. COMPOSANT PAGE PRINCIPALE
export default function Cv() {
  const [data, setData] = useState({ skills: [], projects: [], experiences: [] });
  const [pdpBase64, setPdpBase64] = useState(null);
  const [aboutMe, setAboutMe] = useState(null);

  useEffect(() => {
    fetchAboutMe();
  }, []);

  const fetchAboutMe = async () => {
    try {
      const response = await axiosClient.get('/fetch_about_me');
      setAboutMe(response.data);

      // Fetch profile picture as base64 avy amin'ny Cloudinary URL
      if (response.data?.pdp) {
        try {
          const imgRes = await fetch(response.data.pdp);
          const blob = await imgRes.blob();
          const reader = new FileReader();
          reader.onloadend = () => setPdpBase64(reader.result);
          reader.readAsDataURL(blob);
        } catch (e) {
          console.error('Erreur chargement photo:', e);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  const user = {
    name: aboutMe?.full_name || "Manampitiana",
    job: aboutMe?.title || "Développeur Full Stack",
    email: aboutMe?.email || "",
    phone: aboutMe?.phone || "",
    location: aboutMe?.location || "Antananarivo, Madagascar",
    github_user: "Manampitiana",
    resume: aboutMe?.description || "Développeur Full Stack passionné, spécialisé en React et Laravel. Je crée des applications web modernes, performantes et élégantes depuis Antananarivo, Madagascar.",
  };

  // ✅ Education marina — araka ny tena tantara anao
  const education = [
    {
      degree: "Formation en Développement Web",
      school: "Hopes Formation Andavamamba",
      year: "2024 – 2025",
    },
    {
      degree: "Baccalauréat Technique — Ouvrage Métallique",
      school: "LTP Mantasoa",
      year: "2018 – 2019",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, p, e] = await Promise.all([
          axiosClient.get("/publicSkills"),
          axiosClient.get("/fetch_featured_projects"),
          axiosClient.get("/fetch_experiences")
        ]);
        setData({
          skills: s.data.publicSkills || [],
          projects: p.data.featuredProjects || [],
          experiences: e.data.experiences || []
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Barre d'en-tête */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 rounded-2xl">
          <div>
            <h1 className="font-display text-2xl font-semibold text-white">Curriculum Vitae</h1>
            <p className="text-neutral-500 text-sm">Exportez votre profil professionnel au format PDF.</p>
          </div>

          <PDFDownloadLink
            document={
              <MyCVDocument
                user={user}
                skills={data.skills}
                experiences={data.experiences}
                projects={data.projects}
                education={education}
                pdpBase64={pdpBase64}
              />
            }
            fileName={`CV_${user.name.replace(/\s+/g, '_')}.pdf`}
          >
            {({ loading }) => (
              <button className="bg-white text-neutral-900 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-neutral-200 transition-all active:scale-95">
                {loading ? "Génération..." : "Télécharger le CV (PDF)"}
              </button>
            )}
          </PDFDownloadLink>
        </div>

        {/* Aperçu Web */}
        <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden border border-white/10">

          {/* Sidebar Web */}
          <aside className="w-full md:w-1/3 bg-white/[0.03] text-white p-8 border-r border-white/10">
            <div className="text-center mb-10">
              {pdpBase64 ? (
                <div className="w-32 h-32 mx-auto mb-4 rounded-full p-1 bg-gradient-to-br from-cyan-400 to-fuchsia-400">
                  <img src={pdpBase64} alt="Profil" className="w-full h-full rounded-full object-cover" />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto mb-4 p-1 bg-gradient-to-br from-cyan-400 to-fuchsia-400">
                  <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center">
                    <span className="text-neutral-600 text-4xl">?</span>
                  </div>
                </div>
              )}
              <h2 className="font-display text-xl font-semibold">{user.name}</h2>
              <p className="text-cyan-300 text-sm font-medium uppercase tracking-wider">{user.job}</p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xs uppercase font-semibold text-neutral-500 border-b border-white/10 pb-2 mb-4 tracking-widest">Contact</h3>
                <div className="space-y-3 text-sm text-neutral-300">
                  <div className="flex items-center gap-3"><MapPinIcon className="w-4 h-4 text-cyan-300" /> {user.location}</div>
                  <div className="flex items-center gap-3"><EnvelopeIcon className="w-4 h-4 text-cyan-300" /> {user.email}</div>
                  <div className="flex items-center gap-3"><PhoneIcon className="w-4 h-4 text-cyan-300" /> {user.phone}</div>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase font-semibold text-neutral-500 border-b border-white/10 pb-2 mb-4 tracking-widest">Compétences</h3>
                <div className="space-y-4">
                  {data.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-neutral-300">{skill.name}</span>
                        <span className="text-neutral-500">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase font-semibold text-neutral-500 border-b border-white/10 pb-2 mb-4 tracking-widest">Langues</h3>
                <div className="space-y-2 text-sm text-neutral-300">
                  <div>• Malgache <span className="text-neutral-500">(Maternel)</span></div>
                  <div>• Français <span className="text-neutral-500">(Notions de base)</span></div>
                  <div>• Anglais <span className="text-neutral-500">(Notions de base)</span></div>
                </div>
              </div>
            </div>
          </aside>

          {/* Contenu Principal Web */}
          <main className="flex-1 bg-white/[0.015] p-8 md:p-12">

            {/* Résumé */}
            <section className="mb-12">
              <h3 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-cyan-400 to-fuchsia-400 rounded-full"></div> Résumé
              </h3>
              <p className="text-neutral-400 leading-relaxed text-sm md:text-base">{user.resume}</p>
            </section>

            {/* Expériences */}
            <section className="mb-12">
              <h3 className="font-display text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-cyan-400 to-fuchsia-400 rounded-full"></div> Expériences
              </h3>
              <div className="space-y-8">
                {data.experiences.map((exp, i) => (
                  <div key={i} className="group relative pl-8 border-l border-white/10">
                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-white">{exp.title}</h4>
                      <span className="text-xs font-medium text-neutral-500">{exp.date_range}</span>
                    </div>
                    <p className="text-cyan-300 text-sm mb-2">{exp.company}</p>
                    <p className="text-neutral-400 text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Éducation */}
            <section className="mb-12">
              <h3 className="font-display text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-cyan-400 to-fuchsia-400 rounded-full"></div> Éducation
              </h3>
              <div className="space-y-6">
                {education.map((edu, i) => (
                  <div key={i} className="relative pl-8 border-l border-white/10">
                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-fuchsia-400"></div>
                    <h4 className="font-semibold text-white">{edu.degree}</h4>
                    <p className="text-cyan-300 text-sm mb-1">{edu.school}</p>
                    <p className="text-xs text-neutral-500">{edu.year}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Projets */}
            {data.projects.length > 0 && (
              <section>
                <h3 className="font-display text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <div className="w-2 h-6 bg-gradient-to-b from-cyan-400 to-fuchsia-400 rounded-full"></div> Projets Majeurs
                </h3>
                <div className="space-y-4">
                  {data.projects.slice(0, 3).map((proj, i) => (
                    <div key={i} className="pl-8 border-l border-white/10 relative">
                      <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                      <h4 className="font-semibold text-white text-sm">{proj.title}</h4>
                      <p className="text-neutral-500 text-xs mt-1">{proj.short_description || proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}