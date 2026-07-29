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
  page: { flexDirection: "row", backgroundColor: "#FFFFFF", padding: 0 },
  sidebar: { width: "32%", backgroundColor: "#111827", color: "white", padding: 20 },
  main: { flex: 1, padding: 30, backgroundColor: "#FFFFFF" },
  profileImg: { width: 80, height: 80, borderRadius: 40, marginBottom: 15, alignSelf: 'center', border: '2pt solid #06b6d4' },
  name: { fontSize: 18, fontWeight: "bold", color: "#111827", marginBottom: 4 },
  jobTitle: { fontSize: 10, color: "#0891b2", marginBottom: 15, fontWeight: 'bold', textTransform: 'uppercase' },
  sidebarTitle: { fontSize: 10, fontWeight: "bold", marginTop: 15, marginBottom: 8, color: "#22d3ee", textTransform: 'uppercase', borderBottom: '0.5pt solid #374151', paddingBottom: 2 },
  contactInfo: { fontSize: 8, marginBottom: 6, color: "#d1d5db" },
  skillContainer: { marginBottom: 6 },
  skillLabel: { fontSize: 8, color: "#f3f4f6", marginBottom: 2 },
  skillBar: { height: 2, backgroundColor: "#374151", borderRadius: 1 },
  skillFill: { height: 2, backgroundColor: "#22d3ee", borderRadius: 1 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginTop: 15, marginBottom: 10, color: "#111827", borderLeft: '3pt solid #06b6d4', paddingLeft: 8 },
  description: { fontSize: 9, color: "#4b5563", lineHeight: 1.5, textAlign: 'justify' },
  expItem: { marginBottom: 12 },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  expTitle: { fontSize: 10, fontWeight: 'bold', color: '#1f2937' },
  expDate: { fontSize: 8, color: '#6b7280' },
  company: { fontSize: 9, color: '#0891b2', marginBottom: 3 },
  eduItem: { marginBottom: 10 },
  eduDegree: { fontSize: 10, fontWeight: 'bold', color: '#1f2937' },
  eduSchool: { fontSize: 9, color: '#0891b2', marginBottom: 2 },
  eduYear: { fontSize: 8, color: '#6b7280' },
  bulletPoint: { fontSize: 9, color: '#4b5563', marginBottom: 3, paddingLeft: 5 }
});

// 2. COMPOSANT DOCUMENT PDF
const MyCVDocument = ({ user, skills, experiences, projects, education, pdpBase64 }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* BARRE LATÉRALE */}
      <View style={styles.sidebar}>
        {pdpBase64 && <Image src={pdpBase64} style={styles.profileImg} />}

        <Text style={styles.sidebarTitle}>Contact</Text>
        <Text style={styles.contactInfo}>{user.location}</Text>
        <Text style={styles.contactInfo}>{user.phone}</Text>
        <Text style={styles.contactInfo}>{user.email}</Text>
        <Text style={styles.contactInfo}>github.com/{user.github_user}</Text>

        <Text style={styles.sidebarTitle}>Compétences</Text>
        {skills.map((skill, i) => (
          <View key={i} style={styles.skillContainer}>
            <Text style={styles.skillLabel}>{skill.name}</Text>
            <View style={styles.skillBar}>
              <View style={{ ...styles.skillFill, width: `${skill.level}%` }} />
            </View>
          </View>
        ))}

        <Text style={styles.sidebarTitle}>Langues</Text>
        <Text style={styles.contactInfo}>• Malgache (Maternel)</Text>
        <Text style={styles.contactInfo}>• Français (Notions de base)</Text>
        <Text style={styles.contactInfo}>• Anglais (Notions de base)</Text>
      </View>

      {/* CONTENU PRINCIPAL */}
      <View style={styles.main}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.jobTitle}>{user.job}</Text>

        <Text style={styles.sectionTitle}>Résumé Professionnel</Text>
        <Text style={styles.description}>{user.resume}</Text>

        <Text style={styles.sectionTitle}>Expériences Professionnelles</Text>
        {experiences.map((exp, i) => (
          <View key={i} style={styles.expItem}>
            <View style={styles.expHeader}>
              <Text style={styles.expTitle}>{exp.title}</Text>
              <Text style={styles.expDate}>{exp.date_range}</Text>
            </View>
            <Text style={styles.company}>{exp.company}</Text>
            <Text style={styles.description}>{exp.description}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Projets Majeurs</Text>
        {projects.slice(0, 3).map((proj, i) => (
          <View key={i} style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold' }}>• {proj.title}</Text>
            <Text style={{ ...styles.description, fontSize: 8 }}>{proj.short_description || proj.description}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Éducation</Text>
        {education.map((edu, i) => (
          <View key={i} style={styles.eduItem}>
            <Text style={styles.eduDegree}>{edu.degree}</Text>
            <Text style={styles.eduSchool}>{edu.school}</Text>
            <Text style={styles.eduYear}>{edu.year}</Text>
          </View>
        ))}
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