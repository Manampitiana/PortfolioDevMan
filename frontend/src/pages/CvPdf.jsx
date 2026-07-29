import React from "react";
import { Page, Text, View, Document, StyleSheet, Font, Image } from "@react-pdf/renderer";

// Styles ho an'ny PDF — mitovy loko amin'ny MyCVDocument (Cv.jsx) : cyan/fuchsia
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 20,
    borderBottom: "1pt solid #e5e7eb",
    paddingBottom: 16,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    border: "2pt solid #22d3ee",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    marginBottom: 6,
    color: "#0891b2",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  contact: {
    fontSize: 10,
    color: "#4b5563",
    marginBottom: 2,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#111827",
    borderLeft: "3pt solid #06b6d4",
    paddingLeft: 8,
  },
  skillBarContainer: {
    width: "100%",
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    marginBottom: 4,
  },
  skillBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22d3ee",
  },
  experienceItem: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: "#1f2937",
  },
  itemMeta: {
    fontSize: 9,
    color: "#0891b2",
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 9,
    color: "#6b7280",
  },
  itemDesc: {
    fontSize: 9.5,
    color: "#4b5563",
    lineHeight: 1.4,
  },
  projectItem: {
    marginBottom: 8,
  },
});

// Component PDF
const CvPdf = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        {data.photo && <Image src={data.photo} style={styles.profilePic} />}
        <View>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.contact}>{data.email}</Text>
          {data.github && <Text style={styles.contact}>GitHub: {data.github}</Text>}
          {data.linkedin && <Text style={styles.contact}>LinkedIn: {data.linkedin}</Text>}
        </View>
      </View>

      {/* Résumé */}
      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résumé</Text>
          <Text style={styles.itemDesc}>{data.summary}</Text>
        </View>
      )}

      {/* Compétences */}
      {data.skills && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compétences</Text>
          {data.skills.map((skill, index) => (
            <View key={index} style={{ marginBottom: 6 }}>
              <Text style={styles.itemDesc}>{skill.name} — {skill.level}%</Text>
              <View style={styles.skillBarContainer}>
                <View style={{ ...styles.skillBar, width: `${skill.level}%` }} />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Expériences */}
      {data.experiences && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expériences</Text>
          {data.experiences.map((exp, index) => (
            <View key={index} style={styles.experienceItem}>
              <Text style={styles.itemTitle}>{exp.title} — {exp.company}</Text>
              <Text style={styles.itemDate}>
                {exp.start} - {exp.end || "Present"}
              </Text>
              <Text style={styles.itemDesc}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Projets */}
      {data.projects && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projets</Text>
          {data.projects.map((proj, index) => (
            <View key={index} style={styles.projectItem}>
              <Text style={styles.itemTitle}>{proj.title}</Text>
              <Text style={styles.itemDesc}>{proj.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Éducation */}
      {data.education && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Éducation</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={{ marginBottom: 4 }}>
              <Text style={styles.itemTitle}>{edu.degree}</Text>
              <Text style={styles.itemMeta}>{edu.school} — {edu.year}</Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export default CvPdf;