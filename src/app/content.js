const EMOJI = ['😞', '😕', '😐', '🙂', '😊']
const IDS = ['gita', 'stoic', 'buddhist', 'reason']

const D = {
  en: {
    moods: ['Very low', 'Low', 'Okay', 'Good', 'Very good'],
    chips: ['Career worry', 'Hurt in a relationship', 'Failure or setback', 'Money stress', 'Loneliness', 'Anger', 'Comparing with others', 'A hard decision'],
    thoughts: [
      'You don’t have to solve your whole life today. Just take the next honest step.',
      'Between what happens and how you respond, there is a small space. Use it.',
      'Not every feeling needs action. Some only need to be noticed.',
      'You see other people’s highlights, not their whole story.',
      'Rest is part of the work, not a reward after it.',
      'Ask: what is mine to do here? Do that, and let the rest go.',
      'Money is a tool for life, not the measure of it.',
    ],
    lenses: {
      gita: { name: 'Gita: the lens of action', tagline: 'Focus on effort, not on the result', questions: [
        'What is my effort (action) in this situation, and what is the result that is not in my hands?',
        'If I let go of worrying about the result and only do my part, what is the next step?',
        'What am I holding on to so tightly that it makes this feel heavier?',
        'What is one small thing I can do today with full honesty?',
      ] },
      stoic: { name: 'Stoic: the lens of control', tagline: 'Only what is in your hands', questions: [
        'What in this is fully in my control, and what is not?',
        'What am I telling myself about this? Is it a fact or my opinion?',
        'How would a person I respect handle this?',
        'What is one thing within my control that I can do today?',
      ] },
      buddhist: { name: 'Buddhist: the lens of seeing', tagline: 'First see, then think', questions: [
        'What am I really feeling right now, and where in my body?',
        'What do I want to change? What happens if I let it be as it is for one minute?',
        'What is changing in this, and what has already changed before?',
        'How can I be kind to myself today?',
      ] },
      reason: { name: 'Plain reason: no religion needed', tagline: 'Facts, likelihood, and one small step', questions: [
        'What actually happened? Only facts, in plain words.',
        'What is the worst realistic outcome, and the most likely one?',
        'What would I say to a close friend in this situation?',
        'What is one small step I can take today?',
      ] },
    },
  },
  hl: {
    moods: ['Bahut low', 'Low', 'Theek-thaak', 'Accha', 'Bahut accha'],
    chips: ['Career ki chinta', 'Rishte mein dukh', 'Haar ya failure', 'Paise ka tanav', 'Akelapan', 'Gussa', 'Doosron se tulna', 'Mushkil faisla'],
    thoughts: [
      'Aaj poori zindagi sulajhani zaroori nahi. Bas agla imaandaar kadam uthao.',
      'Jo hua aur tumhara jawab, in dono ke beech thodi jagah hoti hai. Use istemaal karo.',
      'Har ehsaas par kuch karna zaroori nahi. Kuch ko bas dekhna kaafi hai.',
      'Doosron ki sirf achhi jhalak dikhti hai, unki poori kahani nahi.',
      'Aaram kaam ka hissa hai, kaam ke baad ka inaam nahi.',
      'Socho: mera kya kaam hai? Wo karo, baaki chhod do.',
      'Paisa jeevan ka saadhan hai, jeevan ka paimana nahi.',
    ],
    lenses: {
      gita: { name: 'Gita: karm ka lens', tagline: 'Koshish par dhyan, natije par nahi', questions: [
        'Is situation mein meri koshish (karm) kya hai, aur natija kya hai jo mere haath mein nahi?',
        'Agar main natije ki fikr chhod kar sirf apna kaam karun, to agla kadam kya hoga?',
        'Main kis cheez se bahut zyada jud gaya hoon jo is baat ko bhaari bana rahi hai?',
        'Aaj ke liye ek chhota kaam kya hai jo main poori imaandari se kar sakta hoon?',
      ] },
      stoic: { name: 'Stoic: control ka lens', tagline: 'Jo apne haath mein hai, bas wahi', questions: [
        'Is baat mein kya poori tarah mere control mein hai, aur kya nahi?',
        'Main khud ko is baare mein kya keh raha hoon? Ye tathya (fact) hai ya meri raay?',
        'Jis insaan ki main izzat karta hoon, wo yahan kaise pesh aata?',
        'Aaj ek aisi cheez kya hai jo mere control mein hai aur main kar sakta hoon?',
      ] },
      buddhist: { name: 'Buddh: dekhne ka lens', tagline: 'Pehle dekho, phir socho', questions: [
        'Abhi main asal mein kya mehsoos kar raha hoon, aur shareer mein kahan?',
        'Main kya badalna chahta hoon? Agar ek minute ke liye ise jaisa hai waisa rehne doon to kya hota hai?',
        'Is mein kya badal raha hai, aur pehle kya badal chuka hai?',
        'Aaj main apne saath dayalu (kind) tareeke se kaise pesh aa sakta hoon?',
      ] },
      reason: { name: 'Saaf soch: bina dharm ke', tagline: 'Tathya, sambhavna, aur ek chhota kadam', questions: [
        'Asal mein kya hua? Sirf tathya, saaf shabdon mein.',
        'Sabse bura sambhav nateeja kya hai, aur sabse zyada sambhav kya hai?',
        'Agar ye kisi kareebi dost ke saath hota, to main use kya kehta?',
        'Aaj ek chhota kadam kya hai jo main utha sakta hoon?',
      ] },
    },
  },
  hi: {
    moods: ['बहुत उदास', 'उदास', 'ठीक-ठाक', 'अच्छा', 'बहुत अच्छा'],
    chips: ['करियर की चिंता', 'रिश्ते में दुख', 'हार या असफलता', 'पैसों का तनाव', 'अकेलापन', 'गुस्सा', 'दूसरों से तुलना', 'मुश्किल फैसला'],
    thoughts: [
      'आज पूरी ज़िंदगी सुलझाना ज़रूरी नहीं। बस अगला ईमानदार कदम उठाइए।',
      'जो हुआ और आपके जवाब के बीच थोड़ी जगह होती है। उसका इस्तेमाल कीजिए।',
      'हर एहसास पर कुछ करना ज़रूरी नहीं। कुछ को बस देखना काफ़ी है।',
      'दूसरों की सिर्फ़ अच्छी झलक दिखती है, उनकी पूरी कहानी नहीं।',
      'आराम काम का हिस्सा है, काम के बाद का इनाम नहीं।',
      'सोचिए: यहाँ मेरा क्या काम है? वह कीजिए, बाकी छोड़ दीजिए।',
      'पैसा जीवन का साधन है, जीवन का पैमाना नहीं।',
    ],
    lenses: {
      gita: { name: 'गीता: कर्म का नज़रिया', tagline: 'कोशिश पर ध्यान, नतीजे पर नहीं', questions: [
        'इस स्थिति में मेरी कोशिश (कर्म) क्या है, और नतीजा क्या है जो मेरे हाथ में नहीं?',
        'अगर मैं नतीजे की फ़िक्र छोड़कर सिर्फ़ अपना काम करूँ, तो अगला कदम क्या होगा?',
        'मैं किस चीज़ को इतना कसकर पकड़े हूँ कि यह बात भारी लग रही है?',
        'आज के लिए एक छोटा काम क्या है जो मैं पूरी ईमानदारी से कर सकता/सकती हूँ?',
      ] },
      stoic: { name: 'स्टोइक: नियंत्रण का नज़रिया', tagline: 'सिर्फ़ वही जो आपके हाथ में है', questions: [
        'इसमें क्या पूरी तरह मेरे नियंत्रण में है, और क्या नहीं?',
        'मैं खुद से इस बारे में क्या कह रहा/रही हूँ? यह तथ्य है या मेरी राय?',
        'जिस इंसान की मैं इज़्ज़त करता/करती हूँ, वह यहाँ कैसे पेश आता?',
        'आज ऐसी एक चीज़ क्या है जो मेरे नियंत्रण में है और मैं कर सकता/सकती हूँ?',
      ] },
      buddhist: { name: 'बौद्ध: देखने का नज़रिया', tagline: 'पहले देखिए, फिर सोचिए', questions: [
        'अभी मैं असल में क्या महसूस कर रहा/रही हूँ, और शरीर में कहाँ?',
        'मैं क्या बदलना चाहता/चाहती हूँ? अगर एक मिनट इसे जैसा है वैसा रहने दूँ तो क्या होता है?',
        'इसमें क्या बदल रहा है, और पहले क्या बदल चुका है?',
        'आज मैं अपने साथ दयालु कैसे हो सकता/सकती हूँ?',
      ] },
      reason: { name: 'सीधी सोच: बिना धर्म के', tagline: 'तथ्य, संभावना और एक छोटा कदम', questions: [
        'असल में क्या हुआ? सिर्फ़ तथ्य, साफ़ शब्दों में।',
        'सबसे बुरा संभव नतीजा क्या है, और सबसे ज़्यादा संभावित क्या है?',
        'अगर यह किसी करीबी दोस्त के साथ होता, तो मैं उससे क्या कहता/कहती?',
        'आज एक छोटा कदम क्या है जो मैं उठा सकता/सकती हूँ?',
      ] },
    },
  },
}

export function getContent(lang) {
  const d = D[lang] || D.hl
  return {
    MOODS: d.moods.map((l, i) => ({ v: i + 1, e: EMOJI[i], l })),
    TOPIC_CHIPS: d.chips,
    THOUGHTS: d.thoughts,
    LENSES: IDS.map((id) => ({ id, ...d.lenses[id] })),
  }
}
