import React from 'react';
import { Animated, Text, View, StyleSheet, Button } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export default function App() {
	/* main display props */
	const [initialView, setInitialView] = React.useState('flex');
  const initialFade = React.useRef(new Animated.Value(1)).current;
	const [answerView, setAnswerView] = React.useState('none');
	const answerFade = React.useRef(new Animated.Value(0)).current;

	/* display of questions */
	const [questionOpen, setQuestionOpen] = React.useState(false);
	const [questionsFocused, setQuestionsFocused] = React.useState(false);
	const [questionValue, setQuestionValue] = React.useState(null);
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
		console.log(questionValue);
    Animated.timing(initialFade, {
      toValue: 0,
      duration: 1500
    }).start(() => generateAnswer(
			Animated.timing(answerFade, {
				toValue: 1,
				duration: 1500
			}).start(() => generateAnswer())));
	};
	
	const generateAnswer = async () => {
		setInitialView('none');
		setAnswerView('flex');
	};

	const returnToInitial = async () => {
    Animated.timing(answerFade, {
      toValue: 0,
      duration: 1500
    }).start(() => setAnswerView('none'));

    Animated.timing(initialFade, {
      toValue: 1,
      duration: 1500
    }).start(() => setInitialView('flex'));

		setQuestionValue(null);
	};

  return (
		<View style={styles.container}>
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
				<Button
				onPress={submitQuestion}
				title="Confirm"
				color="#841584"
				accessibilityLabel="Button for confirming question selection"
				disabled={questionValue == null}
				/>
			</Animated.View>

			<Animated.View style={[styles.container, {opacity: answerFade, display: answerView}]}>
				<Text>This is the answer view. Nice...</Text>
				
				<Button
				onPress={returnToInitial}
				title="Start over"
				color="#841584"
				accessibilityLabel="Button for returning to question selection"
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
		fontSize: 14,
	},
	selectedTextStyle: {
		fontSize: 14,
	},
	dropdown: {
		width: 225,
		borderColor: 'gray',
		borderWidth: 0.25,
		borderRadius: 300,
		paddingHorizontal: 5,
	},
});
