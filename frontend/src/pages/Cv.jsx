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
import { Github, Linkedin, Globe } from "lucide-react";

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
        <Text style={styles.contactInfo}> {user.location}</Text>
        <Text style={styles.contactInfo}> {user.phone}</Text>
        <Text style={styles.contactInfo}> {user.email}</Text>
        <Text style={styles.contactInfo}> github.com/{user.github_user}</Text>

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
        <Text style={styles.contactInfo}>• Français (Avancé)</Text>
        <Text style={styles.contactInfo}>• Anglais (Technique)</Text>
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
            <Text style={{ ...styles.description, fontSize: 8 }}>{proj.description}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Éducation</Text>
        {education.map((edu, i) => (
          <Text key={i} style={styles.bulletPoint}>• {edu}</Text>
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
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  const user = {
    name: aboutMe?.full_name || "Ravaka Manampitiana",
    job: aboutMe?.title || "Développeur Full Stack",
    email: aboutMe?.email,
    phone: aboutMe?.phone,
    location: aboutMe?.location || "Antananarivo, Madagascar",
    github_user: "Manampitiana",
    linkedin: "https://linkedin.com/in/ravaka-manampitiana",
    resume: aboutMe?.description || "Développeur Full Stack passionné avec une expertise en création d'applications web performantes et évolutives. Compétent dans les technologies front-end et back-end, je m'efforce de concevoir des solutions innovantes qui répondent aux besoins des utilisateurs tout en respectant les meilleures pratiques de développement."
  };

  const education = [
    "Master en Informatique - ESTI (En cours)",
    "Licence en Informatique - Université d'Antananarivo (2021)",
    "Baccalauréat Scientifique - Lycée Moderne (2018)"
  ];

  useEffect(() => {
    fetch("/pdp.png")
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => setPdpBase64(reader.result);
        reader.readAsDataURL(blob);
      });

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
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[var(--theme-color)] pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Barre d'en-tête */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white dark:bg-[var(--theme-color)] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-bold text-[var(--theme-color)] dark:text-white">Curriculum Vitae</h1>
            <p className="text-gray-500 text-sm">Exportez votre profil professionnel au format PDF.</p>
          </div>
          
          <PDFDownloadLink
            document={<MyCVDocument user={user} skills={data.skills} experiences={data.experiences} projects={data.projects} education={education} pdpBase64={pdpBase64} />}
            fileName={`CV_${user.name.replace(/\s+/g, '_')}.pdf`}
          >
            {({ loading }) => (
              <button className="ml-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all active:scale-95">
                {loading ? "Génération..." : "Télécharger le CV (PDF)"}
              </button>
            )}
          </PDFDownloadLink>
        </div>

        {/* Aperçu Web */}
        <div className="flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
          
          {/* Sidebar Web */}
          <aside className="w-full md:w-1/3 bg-[var(--theme-color)] text-white p-8 border-r dark:border-gray-800">
            <div className="text-center mb-10">
              <img src="/pdp.png" alt="Profil" className="w-32 h-32 rounded-full mx-auto border-4 border-blue-500 mb-4 object-cover" />
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-blue-400 text-sm font-medium uppercase tracking-wider">{user.job}</p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xs uppercase font-bold text-gray-500 border-b border-gray-800 pb-2 mb-4 tracking-widest">Contact</h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-3"><MapPinIcon className="w-4 h-4 text-blue-400" /> {user.location}</div>
                  <div className="flex items-center gap-3"><EnvelopeIcon className="w-4 h-4 text-blue-400" /> {user.email}</div>
                  <div className="flex items-center gap-3"><PhoneIcon className="w-4 h-4 text-blue-400" /> {user.phone}</div>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase font-bold text-gray-500 border-b border-gray-800 pb-2 mb-4 tracking-widest">Compétences</h3>
                <div className="space-y-4">
                  {data.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span>{skill.name}</span>
                        <span className="text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-800 rounded-full">
                        <motion.div initial={{width: 0}} animate={{width: `${skill.level}%`}} className="h-full bg-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Contenu Principal Web */}
          <main className="flex-1 bg-white dark:bg-[var(--theme-color)] p-8 md:p-12">
            <section className="mb-12">
              <h3 className="text-lg font-bold text-[var(--theme-color)] dark:text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-600 rounded-full"></div> Résumé
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">{user.resume}</p>
            </section>

            <section className="mb-12">
              <h3 className="text-lg font-bold text-[var(--theme-color)] dark:text-white mb-6 flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-600 rounded-full"></div> Expériences
              </h3>
              <div className="space-y-8">
                {data.experiences.map((exp, i) => (
                  <div key={i} className="group relative pl-8 border-l border-gray-200 dark:border-gray-800">
                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-[var(--theme-color)] dark:text-white">{exp.title}</h4>
                      <span className="text-xs font-medium text-gray-400">{exp.date_range}</span>
                    </div>
                    <p className="text-blue-600 text-sm mb-2">{exp.company}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}