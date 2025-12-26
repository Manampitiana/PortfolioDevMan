import React from "react";
import { Page, Text, View, Document, StyleSheet, Font, Image } from "@react-pdf/renderer";

// Styles ho an'ny PDF
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
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
    color: "#555555",
  },
  contact: {
    fontSize: 12,
    color: "#0077B5",
    marginBottom: 2,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#0d6efd",
  },
  skillBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 4,
  },
  skillBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0dcaf0",
  },
  experienceItem: {
    marginBottom: 8,
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
          <Text>{data.summary}</Text>
        </View>
      )}

      {/* Compétences */}
      {data.skills && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compétences</Text>
          {data.skills.map((skill, index) => (
            <View key={index} style={{ marginBottom: 6 }}>
              <Text>{skill.name} - {skill.level}%</Text>
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
              <Text style={{ fontWeight: "bold" }}>{exp.title} - {exp.company}</Text>
              <Text style={{ fontSize: 10, color: "#555555" }}>
                {exp.start} - {exp.end || "Present"}
              </Text>
              <Text>{exp.description}</Text>
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
              <Text style={{ fontWeight: "bold" }}>{proj.title}</Text>
              <Text>{proj.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Éducation */}
      {data.education && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Éducation</Text>
          {data.education.map((edu, index) => (
            <Text key={index}>• {edu.degree} - {edu.school} ({edu.year})</Text>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export default CvPdf;
