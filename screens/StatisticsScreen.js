import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';

const StatisticsScreen = ({ route }) => {
  const { lakeQualityUri } = route.params || {};
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCSVData = async () => {
      try {
        const csvFile = await FileSystem.readAsStringAsync(lakeQualityUri);
        const parsedData = Papa.parse(csvFile, { header: true, skipEmptyLines: true });
        setData(parsedData.data);
        setLoading(false);
      } catch (error) {
        console.error('Error reading CSV:', error);
        setLoading(false);
      }
    };
    if (lakeQualityUri) {
      loadCSVData();
    }
  }, [lakeQualityUri]);

  // Prepare data for the graphs
  const lakes = data.map(item => item['Lake Name']);
  const pHValues = data.map(item => parseFloat(item['pH']));
  const turbidityValues = data.map(item => parseFloat(item['Turbidity (NTU)']));
  const hardnessValues = data.map(item => parseFloat(item['Hardness (mg/L)']));
  const contaminationValues = data.map(item => parseFloat(item['Contaminants (PPM)']));
  const waterQualityStatus = data.map(item => item['Water Quality Status']);

  // Create the graph data
  const pHGraphData = {
    labels: lakes,
    datasets: [
      {
        data: pHValues,
        color: (opacity = 1) => `rgba(66, 134, 244, ${opacity})`,
      },
    ],
  };

  const turbidityGraphData = {
    labels: lakes,
    datasets: [
      {
        data: turbidityValues,
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
      },
    ],
  };

  const hardnessGraphData = {
    labels: lakes,
    datasets: [
      {
        data: hardnessValues,
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
      },
    ],
  };

  const contaminationGraphData = {
    labels: lakes,
    datasets: [
      {
        data: contaminationValues,
        color: (opacity = 1) => `rgba(153, 102, 255, ${opacity})`,
      },
    ],
  };

  const screenWidth = Dimensions.get('window').width;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading graph...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Water Quality Parameters</Text>

      {/* pH Bar Chart */}
      <Text style={styles.chartTitle}>pH Levels of Bengaluru Lakes</Text>
      <ScrollView horizontal={true}>
        <BarChart
          data={pHGraphData}
          width={screenWidth * 2}
          height={300}
          yAxisLabel="pH"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#f0f0f0',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          fromZero={true}
          showValuesOnTopOfBars={true}
          withInnerLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          yAxisInterval={1}
        />
      </ScrollView>

      {/* Turbidity Bar Chart */}
      <Text style={styles.chartTitle}>Turbidity Levels of Bengaluru Lakes (NTU)</Text>
      <ScrollView horizontal={true}>
        <BarChart
          data={turbidityGraphData}
          width={screenWidth * 2}
          height={300}
          yAxisLabel="NTU"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#f0f0f0',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          fromZero={true}
          showValuesOnTopOfBars={true}
          withInnerLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          yAxisInterval={1}
        />
      </ScrollView>

      {/* Hardness Bar Chart */}
      <Text style={styles.chartTitle}>Hardness Levels of Bengaluru Lakes (mg/L)</Text>
      <ScrollView horizontal={true}>
        <BarChart
          data={hardnessGraphData}
          width={screenWidth * 2}
          height={300}
          yAxisLabel="mg/L"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#f0f0f0',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          fromZero={true}
          showValuesOnTopOfBars={true}
          withInnerLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          yAxisInterval={1}
        />
      </ScrollView>

      {/* Contamination Bar Chart */}
      <Text style={styles.chartTitle}>Contamination Levels of Bengaluru Lakes (PPM)</Text>
      <ScrollView horizontal={true}>
        <BarChart
          data={contaminationGraphData}
          width={screenWidth * 2}
          height={300}
          yAxisLabel="PPM"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#f0f0f0',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          fromZero={true}
          showValuesOnTopOfBars={true}
          withInnerLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          yAxisInterval={1}
        />
      </ScrollView>

      {/* Water Quality Status */}
      <Text style={styles.chartTitle}>Water Quality Status of Bengaluru Lakes</Text>
      <View style={styles.statusContainer}>
        {lakes.map((lake, index) => (
          <View key={index} style={styles.statusItem}>
            <Text style={styles.lakeName}>{lake}</Text>
            <Text style={styles.statusText}>{waterQualityStatus[index]}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  statusContainer: {
    marginTop: 20,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  lakeName: {
    fontSize: 14,
    width: '50%',
    flexWrap: 'wrap',  // Allows the name to go to the next line
  },
  statusText: {
    fontSize: 14,
    color: '#333',
  },
});

export default StatisticsScreen;
