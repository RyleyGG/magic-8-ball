import React, { useEffect } from 'react';
import { Animated, Text, View, StyleSheet, Button } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export default function App() {
	/* main display props */
	const [initialView, setInitialView] = React.useState('flex');
  const initialFade = React.useRef(new Animated.Value(1)).current;
	const [answerView, setAnswerView] = React.useState('none');
	const answerFade = React.useRef(new Animated.Value(0)).current;

	/* question/answer props */
	const [questionsFocused, setQuestionsFocused] = React.useState(false);
	const [questionValue, setQuestionValue] = React.useState(null);
	const [selectedAnswer, setSelectedAnswer] = React.useState(null);
	const [answerDict, setAnswerDict] = React.useState({});
	const [answerCount, setAnswerCount] = React.useState(1);
	const [badAnswerCount, setBadAnswerCount] = React.useState(false);
	const answers = [
		'Yes',
		'No',
		'Uh... absolutely not',
		'I\'ll give it a 50/50 chance',
		'Maybe',
		'Crystal ball is foggy, check back later',
		'Internet tubes are clogged, check back later',
		'Sure, why not?',
		'Why would you even bother asking me that?'
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
	]
	
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
				duration: 1000
			}).start(() => saveAnswers())});
	};
	
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
	};

	const saveAnswers = async () => {

	};

	const returnToInitial = async () => {
    Animated.timing(answerFade, {
      toValue: 0,
      duration: 1000
    }).start(() => {
			setInitialView('flex');
			setAnswerView('none');
			setQuestionValue(null);
			setAnswerDict({});
			Animated.timing(initialFade, {
				toValue: 1,
				duration: 1000
			}).start()});

	};

	useEffect(async () => {
		if (answerCount < 1 || answerCount > 1000) {
			setBadAnswerCount(true);
		}
		else {
			setBadAnswerCount(false);
		}
	}, [answerCount]);

	const viewLocalStats = async () => {

	};

	const viewGlobalStats = async () => {

	};

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
				{Object.keys(answerDict).map((answer) => (
					<Text><b><i>{answer}</i></b> was rolled {answerDict[answer]} times</Text>
				))}<br /><br />
				
				<Button
				onPress={returnToInitial}
				title="Start over"
				color="#841584"
				accessibilityLabel="Button for returning to question selection"
				/>

				<Button
				onPress={viewLocalStats}
				title="View local stats"
				color="#841584"
				accessibilityLabel="Button for displaying local answer stats"
				/>

				<Button
				onPress={viewGlobalStats}
				title="View global stats"
				color="#841584"
				accessibilityLabel="Button for displaying global answer stats"
				/>
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
