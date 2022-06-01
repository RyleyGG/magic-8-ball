import React, { useEffect } from 'react';
import { Animated, Text, View, StyleSheet, Button, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import {
    BarChart,
  } from "react-native-chart-kit";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
	/* main display props */
	const [initialView, setInitialView] = React.useState('flex');
  const initialFade = React.useRef(new Animated.Value(1)).current;
	const [answerView, setAnswerView] = React.useState('none');
	const answerFade = React.useRef(new Animated.Value(0)).current;

	/* question/answer props */
	const [questionsFocused, setQuestionsFocused] = React.useState(false);
	const [questionValue, setQuestionValue] = React.useState(null);
	const [answerDict, setAnswerDict] = React.useState({});
	const [globalAnswers, setGlobalAnswers] = React.useState({});
	const [globalQuestionResults, setGlobalQuestionResults] = React.useState({});
	const [answerCount, setAnswerCount] = React.useState(100);
	const [badAnswerCount, setBadAnswerCount] = React.useState(false);
	const answers = [
		'Yes',
		'Absolutely!',
		'Without a doubt',
		'No',
		'Uh... absolutely not',
		'I\'ll give it a 50/50 chance',
		'Maybe',
		'Crystal ball broken, sorry!',
		'Sure, why not?',
		'Why bother asking?'
	];
	
	const questions  = [
		{label: 'Should I eat pineapple on my pizza?', value: 'pineapple_pizza'},
		{label: 'Should I use tabs to indent my code?', value: 'tabs_indent'},
		{label: 'Should I use spaces to indent my code?', value: 'space_indent'},
		{label: 'Will I ever be a billionaire?', value: 'billionaire'},
		{label: 'Should I eat spaghetti for dinner?', value: 'spaghetti_dinner'},
		{label: 'Would I survive the zombie apocalypse?', value: 'zombie_survival'},
		{label: 'Should I use AWS for my next full-stack project?', value: 'aws_project'},
		{label: 'Should I use Google Cloud for my next full-stack project?', value: 'cloud_project'},
		{label: 'Should I use Microsoft Azure for my next full-stack project?', value: 'azure_project'},
		{label: 'Would I beat Mike Tyson in a boxing match?', value: 'mike_tyson_boxing'},
		{label: 'Would I beat Mike Tyson in a game of Chess?', value: 'mike_tyson_chess'},
		{label: 'Should I get another cat?', value: 'new_cat'},
		{label: 'Should I get another dog?', value: 'new_dog'},
		{label: 'Will I ever go to jail?', value: 'jail'},
		{label: 'Will I ever break out of jail?', value: 'jail_break'}
	];

	const [barData, setBarData] = React.useState({labels: [], datasets: [{data: []}]});
	const [globalBarData, setGlobalBarData] = React.useState({labels: [], datasets: [{data: []}]});
	const [globalQuestionBarData, setGlobalQuestionBarData] = React.useState({labels: [], datasets: [{data: []}]});


	const chartConfig = {
		backgroundGradientFrom: "#1E2923",
		backgroundGradientTo: "#1E2923",
		decimalPlaces: 0,
		color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
		labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
	};
	
	useEffect(async () => {
		try {
			const globalDataFromStorage = await AsyncStorage.getItem('globalStats')
			if(globalDataFromStorage !== null) {
				setGlobalAnswers(JSON.parse(globalDataFromStorage));
				setBarData({labels: Object.keys(globalAnswers), datasets: [{data: Object.values(globalAnswers)}]});
			}
		} catch(error) {
			console.log(error);
		}
	}, []);

	/* APP TRAVERSAL FUNCTIONS */
	const toInitial = async (fadeObj) => {
    Animated.timing(fadeObj, {
      toValue: 0,
      duration: 1000
    }).start(() => {
			setInitialView('flex');
			setAnswerView('none');
			setQuestionValue(null);
			setAnswerDict({});
			setGlobalQuestionResults({});
			Animated.timing(initialFade, {
				toValue: 1,
				duration: 1000,
			}).start()});
	};

	const submitQuestion = async () => {
    Animated.timing(initialFade, {
      toValue: 0,
      duration: 1000
    }).start(() => {
			generateAnswers();
			setAnswerView('flex');
			setInitialView('none');
			Animated.timing(answerFade, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: false,
			}).start()});
	};
	
	
	/* MAIN FUNCTIONS */
	const generateAnswers = async () => {
		let iter = 0;

		while (iter < answerCount) {
			const newAnswer = answers[Math.floor(Math.random() * answers.length)];

			if (Object.keys(answerDict).includes(newAnswer)) {
				answerDict[newAnswer] = answerDict[newAnswer] + 1;
			}
			else {
				answerDict[newAnswer] = 1;
			}

			iter++;
		}

		/* once answers are generated, save in bar data in appropriate format */
		setBarData({labels: Object.keys(answerDict), datasets: [{data: Object.values(answerDict)}]});
		saveAnswers();
	};

	const saveAnswers = async () => {
		try {
			if (Object.keys(globalAnswers).length == 0) { /* if global dictionary wasn't grabbed from storage, create new */
				await AsyncStorage.setItem('globalStats', JSON.stringify(answerDict));
				setGlobalAnswers(answerDict);
				setGlobalBarData({labels: Object.keys(answerDict), datasets: [{data: Object.values(answerDict)}]});
			}
			else { /* merge local results with global results and re-save */
				const localAnswerKeys = Object.keys(answerDict);
				for (let i = 0; i < localAnswerKeys.length; i++) {
					const curKey = localAnswerKeys[i];
					if (Object.keys(globalAnswers).includes(curKey)) {
						globalAnswers[curKey] = globalAnswers[curKey] + answerDict[curKey];
					}
					else {
						globalAnswers[curKey] = answerDict[curKey];
					}
				}

				await AsyncStorage.setItem('globalStats', JSON.stringify(globalAnswers));
				setGlobalBarData({labels: Object.keys(globalAnswers), datasets: [{data: Object.values(globalAnswers)}]});
			}

			let questionResultsFromStorage = await AsyncStorage.getItem(questionValue);
			if (questionResultsFromStorage === null) { /* if global dictionary wasn't grabbed from storage, create new */
				await AsyncStorage.setItem(questionValue, JSON.stringify(answerDict));
				setGlobalQuestionResults(answerDict);
				setGlobalQuestionBarData({labels: Object.keys(answerDict), datasets: [{data: Object.values(answerDict)}]});
			}
			else { /* merge local results with global results and re-save */
				questionResultsFromStorage = JSON.parse(questionResultsFromStorage);
				const localAnswerKeys = Object.keys(answerDict);
				for (let i = 0; i < localAnswerKeys.length; i++) {
					const curKey = localAnswerKeys[i];
					if (Object.keys(questionResultsFromStorage).includes(curKey)) {
						questionResultsFromStorage[curKey] = questionResultsFromStorage[curKey] + answerDict[curKey];
					}
					else {
						questionResultsFromStorage[curKey] = answerDict[curKey];
					}
				}

				await AsyncStorage.setItem(questionValue, JSON.stringify(questionResultsFromStorage));
				setGlobalQuestionResults(questionResultsFromStorage);
				setGlobalQuestionBarData({labels: Object.keys(questionResultsFromStorage), datasets: [{data: Object.values(questionResultsFromStorage)}]});
			}
		}
		catch (error) {
			console.log(error);
		}
	};

	const sortStats = async () => {
		/* first sort occurrence values */
		const localAnswerKeys = [];
		const answerKeyArr = Object.keys(answerDict);
		const answerValueArr = Object.values(answerDict);
		const sortedData = Object.values(answerDict).sort((a, b) => {
			if (a < b) {
				return -1;
			}
			else if (a > b) {
				return 1;
			}
			return 0;
		});
		
		/* then sort keys based on sorted values */
		for (let i = 0; i < sortedData.length; i++) {
			const valueIndex = answerValueArr.indexOf(sortedData[i]);
			localAnswerKeys.push(answerKeyArr[valueIndex]);
			answerKeyArr.splice(valueIndex, 1);
			answerValueArr.splice(valueIndex, 1);
		}

		/* finally, reconstruct dictionary and send to the state */
		const newDict = {};
		for (let i = 0; i < localAnswerKeys.length; i++) {
			newDict[localAnswerKeys[i]] = sortedData[i];
		}
		setAnswerDict(newDict);
		setBarData({labels: Object.keys(newDict), datasets: [{data: Object.values(newDict)}]});

		/* first sort occurrence values */
		const localGlobalKeys = [];
		const globalKeyArr = Object.keys(globalAnswers);
		const globalValueArr = Object.values(globalAnswers);
		const globalSortedData = Object.values(globalAnswers).sort((a, b) => {
			if (a < b) {
				return -1;
			}
			else if (a > b) {
				return 1;
			}
			return 0;
		});
		
		/* then sort keys based on sorted values */
		for (let i = 0; i < globalSortedData.length; i++) {
			const valueIndex = globalValueArr.indexOf(globalSortedData[i]);
			localGlobalKeys.push(globalKeyArr[valueIndex]);
			globalKeyArr.splice(valueIndex, 1);
			globalValueArr.splice(valueIndex, 1);
		}

		/* finally, reconstruct dictionary and send to the state */
		const newGlobalDict = {};
		for (let i = 0; i < localGlobalKeys.length; i++) {
			newGlobalDict[localGlobalKeys[i]] = globalSortedData[i];
		}
		setGlobalAnswers(newGlobalDict);
		setGlobalBarData({labels: Object.keys(newGlobalDict), datasets: [{data: Object.values(newGlobalDict)}]});

		/* first sort occurrence values */
		const localGlobalQuestionKeys = [];
		const globalQuestionKeyArr = Object.keys(globalQuestionResults);
		const globalQuestionValueArr = Object.values(globalQuestionResults);
		const globalQuestionSortedData = Object.values(globalQuestionResults).sort((a, b) => {
			if (a < b) {
				return -1;
			}
			else if (a > b) {
				return 1;
			}
			return 0;
		});
		
		/* then sort keys based on sorted values */
		for (let i = 0; i < globalQuestionSortedData.length; i++) {
			const valueIndex = globalQuestionValueArr.indexOf(globalQuestionSortedData[i]);
			localGlobalQuestionKeys.push(globalQuestionKeyArr[valueIndex]);
			globalQuestionKeyArr.splice(valueIndex, 1);
			globalQuestionValueArr.splice(valueIndex, 1);
		}

		/* finally, reconstruct dictionary and send to the state */
		const newGlobalQuestionDict = {};
		for (let i = 0; i < localGlobalKeys.length; i++) {
			newGlobalQuestionDict[localGlobalQuestionKeys[i]] = globalQuestionSortedData[i];
		}
		setGlobalQuestionResults(newGlobalQuestionDict);
		setGlobalQuestionBarData({labels: Object.keys(newGlobalQuestionDict), datasets: [{data: Object.values(newGlobalQuestionDict)}]});
	}


	useEffect(async () => {
		if (answerCount < 1 || answerCount > 1000) {
			setBadAnswerCount(true);
		}
		else {
			setBadAnswerCount(false);
		}
	}, [answerCount]);


  return (
		<View style={styles.container}>
			{/* Initial view (question select) */}
			<Animated.View style={[styles.container, {opacity: initialFade, display: initialView}]}>
				<Text>Select your question from the dropdown below<br />and confirm when you're ready for your <b>fate</b></Text>
				<br />
        <Dropdown
          style={[styles.dropdown, questionsFocused && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={questions}
          labelField="label"
          valueField="value"
          placeholder={!questionsFocused ? 'Select item' : '...'}
          value={questionValue}
          onFocus={() => setQuestionsFocused(true)}
          onBlur={() => setQuestionsFocused(false)}
          onChange={item => {
            setQuestionValue(item.value);
            setQuestionsFocused(false);
          }}
        />
				<br />
				<Text>Enter the number of answers to generate for this question (1-1000)</Text>
				<input
					type="text"
					pattern="[0-9]*"
					value={answerCount}
					onChange={(e) =>
						setAnswerCount((v) => (e.target.validity.valid ? e.target.value : v))
					}
				/>
				<br /><br />
				<Button
				onPress={submitQuestion}
				title="Confirm"
				color="#841584"
				accessibilityLabel="Button for confirming question selection"
				disabled={questionValue == null || badAnswerCount}
				/>
			</Animated.View>

			{/* answer display */}
			<Animated.View style={[styles.container, {opacity: answerFade, display: answerView}]}>
				<Text style={{fontSize: 20, fontWeight: 'bold'}}>Local results for your question</Text>
				<BarChart
				data={barData}
				width={Dimensions.get("window").width * 0.9}
				height={500}
				yAxisInterval = {1}
				fromZero = {true}
				showValuesOnTopOfBars = {true}
				chartConfig={chartConfig}
				/><br /><br />

				<Text style={{fontSize: 20, fontWeight: 'bold'}}>Global results (all results for your question)</Text>
				<BarChart
				data={globalQuestionBarData}
				width={Dimensions.get("window").width * 0.9}
				height={500}
				yAxisInterval = {1}
				fromZero = {true}
				showValuesOnTopOfBars = {true}
				chartConfig={chartConfig}
				/><br /><br />


				<Text style={{fontSize: 20, fontWeight: 'bold'}}>Global results (all results for all questions)</Text>
				<BarChart
				data={globalBarData}
				width={Dimensions.get("window").width * 0.9}
				height={500}
				yAxisInterval = {1}
				fromZero = {true}
				showValuesOnTopOfBars = {true}
				chartConfig={chartConfig}
				/><br /><br />
				
      	<View style={styles.buttonView}>
					<Button
					onPress={() => toInitial(answerFade)}
					title="Start over"
					color="#841584"
					accessibilityLabel="Button for returning to question selection"
					/>

					<Button
					onPress={() => sortStats()}
					title="Sort Occurrences"
					color="#841584"
					accessibilityLabel="Sorts the local stats from lowest to highest in terms of occurrence count"
					/>
				</View>
			</Animated.View>
		</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    padding: 10,
  },
	placeholderStyle: {
		fontSize: 13,
	},
	selectedTextStyle: {
		fontSize: 13,
	},
	dropdown: {
		width: 500,
		borderColor: 'gray',
		borderWidth: 0.25,
		borderRadius: 300,
		paddingHorizontal: 5,
	},
});
