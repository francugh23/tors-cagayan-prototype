"use client";

import { TravelHistory } from "@/app/(protected)/home/table/columns";
import { fetchStationById } from "@/data/stations";
import {
  Document,
  Page,
  Image,
  Text,
  View,
  StyleSheet,
  Svg,
  Line,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface TravelOrderPDFProps {
  user: any;
  details: TravelHistory;
}

const styles = StyleSheet.create({
  body: {
    padding: 50,
  },
  header: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  logo: {
    width: 54.72,
    height: 54.72,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    fontFamily: "Times-Roman",
  },
  subtitle: {
    fontSize: 11,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Helvetica",
  },
  content: {
    marginTop: 90,
    paddingBottom: 80,
    fontFamily: "Helvetica",
  },
  table: {
    width: "100%",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
    fontSize: 10,
  },
  tableCellCode: {
    width: "30%",
    padding: 5,
    fontSize: 12,
    fontWeight: "bold",
    borderRightWidth: 1,
    borderRightColor: "#000",
    fontFamily: "Times-Roman",
  },
  tableCellDescription: {
    flex: 1,
    padding: 5,
    fontSize: 10,
    fontFamily: "Times-Roman",
  },
  rowSignee: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
  },
  cellSignee: {
    width: "50%",
    padding: 10,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Times-Roman",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  signature: {
    position: "absolute",
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    fontSize: 10,
    fontFamily: "Helvetica",
    alignSelf: "center",
    zIndex: 1,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerCell: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerCellDesc: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  footerSubTitle: {
    fontSize: 10,
    textAlign: "left",
    fontFamily: "Helvetica",
  },
});

export const TravelOrderPDF = ({ user, details }: TravelOrderPDFProps) => {
  const [station, setStation] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetchStationById(user?.user?.stationId);
        setStation(res);
      } catch (e) {
        return null;
      }
    }
    fetchData();
  }, [user?.user?.stationId]);

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        {/* Document Header */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Seal_of_the_Department_of_Education_of_the_Philippines.png/1200px-Seal_of_the_Department_of_Education_of_the_Philippines.png?20130331031310"
          />
          <Text style={styles.subtitle}>Republic of the Philippines</Text>
          <Text style={styles.headerTitle}>Department of Education</Text>
          <Text style={styles.subtitle}>Region II – Cagayan Valley</Text>
          <Text style={styles.subtitle}>
            SCHOOLS DIVISION OFFICE OF NUEVA VIZCAYA
          </Text>

          <Svg height="5" width="90%">
            <Line
              x1="36"
              y1="0"
              x2="501.6"
              y2="0"
              strokeWidth={2}
              stroke="rgb(0,0,0)"
            />
          </Svg>
        </View>

        {/* Document Content */}
        <View style={styles.content}>
          <Text style={styles.title}>TRAVEL AUTHORITY FOR OFFICIAL TRAVEL</Text>
          <Svg height="5" width="90%">
            <Line
              x1="115"
              y1="0"
              x2="380"
              y2="0"
              strokeWidth={2}
              stroke="rgb(0,0,0)"
            />
          </Svg>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellCode}>Name</Text>
              <Text style={styles.tableCellDescription}>
                {`${user?.user?.name} ${details?.additionalParticipants}`}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellCode}>Position/Designation</Text>
              <Text style={styles.tableCellDescription}>
                {user?.user?.positionDesignation}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellCode}>Permanent Station</Text>
              <Text
                style={styles.tableCellDescription}
              >{`${station?.office}-${station?.unit}`}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellCode}>
                Purpose of Travel{" "}
                <Text style={styles.tableCellDescription}>
                  (must be supported by attachment)
                </Text>
              </Text>
              <Text style={styles.tableCellDescription}>
                {details?.purpose}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellCode}>Host of Activity</Text>
              <Text style={styles.tableCellDescription}>{details?.host}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellCode}>Inclusive Dates</Text>
              <Text style={styles.tableCellDescription}>
                {details?.inclusiveDates}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellCode}>Destination</Text>
              <Text style={styles.tableCellDescription}>
                {details?.destination}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellCode}>Fund Source</Text>
              <Text style={styles.tableCellDescription}>
                {details?.fundSource}
              </Text>
            </View>
            <View style={[styles.tableRow, { borderRightWidth: 1 }]}>
              <Text
                style={[
                  { fontStyle: "italic" },
                  { fontSize: 12 },
                  { textAlign: "justify" },
                  { margin: 5 },
                  { fontFamily: "Times-Roman" },
                ]}
              >
                I hereby attest that the information in this form and in the
                supporting documents attached hereto are true and correct.
              </Text>
            </View>

            {/* Employee Signature */}
            <View style={styles.rowSignee}>
              <View style={[styles.cellSignee, { borderRightWidth: 1 }]}>
                <Image
                  src={user?.user?.signature as string}
                  style={styles.signature}
                />
                <Text>{user?.user?.name}</Text>
                <Text>{user?.user?.positionDesignation}</Text>
              </View>

              <View style={styles.cellSignee}>
                <Text>
                  {format(new Date(details.createdAt), "MMMM dd, yyyy hh:mm a")}
                </Text>
                <Text>Date and Time</Text>
              </View>
            </View>

            <View style={[styles.tableRow, { borderRightWidth: 1 }]}>
              <Text
                style={[
                  { fontStyle: "italic" },
                  { fontSize: 12 },
                  { textAlign: "justify" },
                  { margin: 5 },
                  { fontFamily: "Times-Roman" },
                ]}
              >
                This is to certify that the trip of the requesting employee
                satisfies all the minimum conditions for authorized official
                travel and that alternatives to travel are sufficient purpose
                stated herein.
              </Text>
            </View>

            {/* Recommending Approval */}
            <View style={styles.tableRow}>
              <Text
                style={[
                  {
                    padding: 5,
                    fontSize: 12,
                    fontWeight: "bold",
                    fontFamily: "Times-Roman",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                  },
                ]}
              >
                RECOMMENDING APPROVAL:
              </Text>
            </View>

            {/* Recommending Approval Signature */}
            <View style={styles.rowSignee}>
              <View style={[styles.cellSignee, { borderRightWidth: 1 }]}>
                <Image
                  src={details?.recommendingSignature as string}
                  style={styles.signature}
                />
                <Text>Adonis C. Ceperez EdD, CESE</Text>
                <Text>Assistant Schools Division Superintendent</Text>
              </View>

              <View style={styles.cellSignee}>
                <Text>
                  {format(
                    new Date(details.recommendingApprovalAt),
                    "MMMM dd, yyyy hh:mm a"
                  )}
                </Text>
                <Text>Date and Time</Text>
              </View>
            </View>

            {/* Final Approval */}
            <View style={styles.tableRow}>
              <Text
                style={[
                  {
                    padding: 5,
                    fontSize: 12,
                    fontWeight: "bold",
                    fontFamily: "Times-Roman",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                  },
                ]}
              >
                APPROVED:
              </Text>
            </View>

            {/* Final Approval Signature */}
            <View style={styles.rowSignee}>
              <View style={[styles.cellSignee, { borderRightWidth: 1 }]}>
                <Image src={details.finalSignature as string} style={styles.signature} />
                <Text>Orlando E. Manuel PhD, CESO V</Text>
                <Text>Schools Division Superintendent</Text>
              </View>

              <View style={styles.cellSignee}>
                <Text>
                  {format(
                    new Date(details.finalApprovalAt),
                    "MMMM dd, yyyy hh:mm a"
                  )}
                </Text>
                <Text>Date and Time</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Document Footer */}
        <View style={styles.footer}>
          <Svg height="5" width="100%">
            <Line
              x1="36"
              y1="0"
              x2="541.6"
              y2="0"
              strokeWidth={1}
              stroke="rgb(0,0,0)"
            />
          </Svg>
          <View style={styles.footerRow}>
            <View style={[styles.footerCell, { width: "30%" }]}>
              <Image
                style={[{ width: 77.04, height: 23.76 }]}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR93RnglBLO7dUbdNdD2RXmFgLC1mmdz12A5Q&s"
              />
              <Image
                style={[{ width: 58.32, height: 54.72 }]}
                src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Bagong_Pilipinas_logo.png"
              />
              <Image
                style={[styles.logo, { marginRight: 5 }]}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwQBu4wLq030N-3FUvLwnWvLu9OnxKl6Wb_g&s"
              />
            </View>
            <View style={[styles.footerCellDesc, { width: "70%" }]}>
              <View style={styles.footerRow}>
                <Text style={[{ fontWeight: "bold", marginRight: 2 }]}>
                  Address:
                </Text>
                <Text style={styles.footerSubTitle}>
                  Quezon St., Don Domingo Maddela, Bayombong, Nueva Vizcaya
                </Text>
              </View>
              <View style={styles.footerRow}>
                <Text style={[{ fontWeight: "bold", marginRight: 2 }]}>
                  Telephone Nos.:
                </Text>
                <Text style={styles.footerSubTitle}>
                  (078) 362-0106, 09171589946
                </Text>
              </View>
              <View style={styles.footerRow}>
                <Text style={[{ fontWeight: "bold", marginRight: 2 }]}>
                  Email Address:
                </Text>
                <Text style={styles.footerSubTitle}>
                  nuevavizcaya@deped.gov.ph
                </Text>
              </View>
              <View style={styles.footerRow}>
                <Text style={[{ fontWeight: "bold", marginRight: 2 }]}>
                  Website:
                </Text>
                <Text style={styles.footerSubTitle}>www.deped-nv.com.ph</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
