import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { CardField, useStripe, initStripe } from '@stripe/stripe-react-native';

export default function PaymentScreen({ route, navigation }) {
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment } = useStripe();
  const { rideId } = route.params;

  useEffect(() => {
    initStripe({ publishableKey: 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX' });
  }, []);

  const handlePayPress = async () => {
    const response = await fetch(
      'http://localhost:5000/api/ride/create-payment-intent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 22000 }),
      }
    );
    const { clientSecret, paymentIntentId } = await response.json();

    const { paymentIntent, error } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
      paymentMethodData: {
        billingDetails: {
          email: 'test@example.com',
        },
      },
    });

    if (error) {
      Alert.alert('Payment failed', error.message);
    } else if (paymentIntent) {
      await fetch(
        `http://192.168.0.112:3000/api/ride/update-payment/${rideId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            status: paymentIntent.status,
          }),
        }
      );
      Alert.alert('Payment successful', 'Your ride is confirmed!');
      navigation.navigate('Home');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 10 }}>Enter your card details</Text>
      <CardField
        postalCodeEnabled={false}
        placeholder={{ number: '4242 4242 4242 4242' }}
        cardStyle={{ backgroundColor: '#FFFFFF', textColor: '#000000' }}
        style={{ height: 50, marginVertical: 30 }}
        onCardChange={(card) => setCardDetails(card)}
      />
      <Button title='Pay $220' onPress={handlePayPress} />
    </View>
  );
}
