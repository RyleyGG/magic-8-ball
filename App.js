import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function App() {
		/* main display props */
		const [initialView, setInitialView] = React.useState(true);

		/* display of questions */
    const [questionOpen, setQuestionOpen] = React.useState(false);
    const [questionValue, setQuestionValue] = React.useState(null);
    const [questions, setQuestions] = React.useState([
      {label: 'Apple', value: 'apple'},
      {label: 'Banana', value: 'banana'}
    ])

  return (
    <View style={styles.container} display={initialView}>
      <Text>Select your question from the dropdown below<br />and confirm when you're ready for your <b>fate</b></Text>
			<DropDownPicker
			open={questionOpen}
			value={questionValue}
			items={questions}
			setOpen={setQuestionOpen}
			setValue={setQuestionValue}
			setItems={setQuestions}
			/>
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
