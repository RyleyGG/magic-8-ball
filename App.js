import React from 'react';
import { Animated, Text, View, StyleSheet, Button } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function App() {
	/* main display props */
	const [initialView, setInitialView] = React.useState('flex');
  const initialFade = React.useRef(new Animated.Value(1)).current;
	const [answerView, setAnswerView] = React.useState('none');
	const answerFade = React.useRef(new Animated.Value(0)).current;

	/* display of questions */
	const [questionOpen, setQuestionOpen] = React.useState(false);
	const [questionValue, setQuestionValue] = React.useState(null);
	const [questions, setQuestions] = React.useState([
		{label: 'Apple', value: 'apple'},
		{label: 'Banana', value: 'banana'}
	])
	
	const submitQuestion = async () => {
		console.log(questionValue);
    Animated.timing(initialFade, {
      toValue: 0,
      duration: 1500
    }).start(() => generateAnswer());
	};
	
	const generateAnswer = async () => {
		setInitialView('none');
		setAnswerView('flex');
    Animated.timing(answerFade, {
      toValue: 1,
      duration: 1500
    }).start();
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

	};

  return (
		<View style={styles.container}>
			<Animated.View style={[styles.container, {opacity: initialFade, display: initialView}]}>
				<Text>Select your question from the dropdown below<br />and confirm when you're ready for your <b>fate</b></Text>
				<DropDownPicker
				open={questionOpen}
				value={questionValue}
				items={questions}
				setOpen={setQuestionOpen}
				setValue={setQuestionValue}
				setItems={setQuestions}
				/>
				
				<Button
				onPress={submitQuestion}
				title="Confirm"
				color="#841584"
				accessibilityLabel="Button for confirming question selection"
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
});
