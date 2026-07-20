import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PushNotifications } from '@capacitor/push-notifications';


declare var window: any;
declare var Insider: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage {
  taxonomy: string[] = ['taxonomy1', 'taxonomy2', 'taxonomy3'];

  constructor(private platform: Platform) {
    // Uygulama platformu hazır olduğunda Insider'ı başlatabilirsiniz
    platform.ready().then(() => {
      this.initInsider();
      this.addListeners(platform);
    });
  }

  async addListeners(platform: Platform) {
    await PushNotifications.addListener('registration', token => {
      console.info('Registration token: ', token.value);
    });
  
    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });
  
    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
    });
  
    await PushNotifications.addListener('pushNotificationActionPerformed', actionConfig => {
      console.log('Push notification action performed', actionConfig.actionId, actionConfig.inputValue);

      /**
       * This code is only required for iOS, as the Insider SDK automatically manages notification click actions on Android.
       */
      if (platform.is("ios") && (actionConfig.notification.data || {}).source === "Insider") {
        window.Insider.handleNotification(actionConfig.notification.data);
      }
    });
  }

  // Uygulama ilk açıldığında Insider SDK’yı başlatma
  async initInsider() {
    try {
      // FIXME-INSIDER: Kendi partner name ve app group'unuzu girin.
      await window.Insider.init(
        'your_partner_name',
        'group.com.useinsider.IonicDemo',
        (callback: any) => {
          const result = callback?.result || {};
          switch (result.type) {
            case window.Insider.callbackType.NOTIFICATION_OPEN:
              console.log('[INSIDER][NOTIFICATION_OPEN]: ', result);
              break;
            case window.Insider.callbackType.TEMP_STORE_CUSTOM_ACTION:
              console.log('[INSIDER][TEMP_STORE_CUSTOM_ACTION]: ', result);
              break;
            case window.Insider.callbackType.INAPP_SEEN:
              console.log('[INSIDER][INAPP_SEEN]: ', result);
              break;
          }
        },
      );

      window.Insider.setActiveForegroundPushView();
      window.Insider.startTrackingGeofence();
      window.Insider.enableIDFACollection(true);
      window.Insider.enableLocationCollection(true);
      window.Insider.enableIpCollection(true);
      window.Insider.enableCarrierCollection(true);

      console.log('[INSIDER][initialize]: Method is triggered');
    } catch (error) {
      console.error('Insider init error:', error);
    }
  }

  // -------------------------------
  // User Attributes
  // -------------------------------
  userAttributes() {
    const currentUser = window.Insider.getCurrentUser();
    const stringArray = ['value1', 'value2', 'value3'];

    currentUser
      .setName('John')
      .setSurname('Doe')
      .setAge(23)
      .setGender(Insider.gender.FEMALE)
      .setBirthday(new Date())
      .setEmailOptin(true)
      .setSMSOptin(true)
      .setPushOptin(true)
      .setLocationOptin(true)
      .setWhatsappOptin(true)
      .setFacebookID('Facebook-ID')
      .setTwitterID('Twittter-ID')
      .setLanguage('TR')
      .setLocale('tr_TR');

    currentUser.setCustomAttributeWithString('string_parameter', 'This is Insider.');
    currentUser.setCustomAttributeWithInt('int_parameter', 10);
    currentUser.setCustomAttributeWithDouble('double_parameter', 10.5);
    currentUser.setCustomAttributeWithBoolean('bool_parameter', true);
    currentUser.setCustomAttributeWithDate('date_parameter', new Date());
    currentUser.setCustomAttributeWithArray('key', stringArray);

    console.log('[INSIDER][userAttributes]: Method is triggered');
  }

  // -------------------------------
  // User Identifiers
  // -------------------------------
  async login() {
    const currentUser = window.Insider.getCurrentUser();
    const identifiers = Insider.identifier();

    identifiers.addEmail('mobile.test@useinsider.com');
    identifiers.addPhoneNumber('+909876543210');
    identifiers.addUserID('{crmID}');

    // Callback üzerinden dönen id'yi alert ile gösteriyoruz
    currentUser.login(identifiers.getIdentifiers(), (id: string) => alert(id));
    console.log('[INSIDER][login]: Method is triggered. Identifiers: ', identifiers);
  }

  async logout() {
    const currentUser = window.Insider.getCurrentUser();
    currentUser.logout();
    console.log('[INSIDER][logout]: Method is triggered.');
  }

  // -------------------------------
  // Event
  // -------------------------------
  async triggerEvents() {
    // Basit bir event
    const event1 = await window.Insider.tagEvent('event_name').build();

    // Parametreli bir event
    const event2 = await window.Insider
      .tagEvent('second_event')
      ?.addParameterWithInt('int_parameter', 10)
      .addParameterWithDate('date_parameter', new Date())
      .addParameterWithDouble('double_parameter', 10.5)
      .addParameterWithBoolean('bool_parameter', true)
      .addParameterWithString('string_parameter', 'This is Insider.')
      .build();

    const event3 = await window.Insider
      .tagEvent('third_event')
      ?.addParameterWithInt('int_parameter', 10)
      .build();

    console.log('[INSIDER][triggerEvents]: Method is triggered.');
  }

  // -------------------------------
  // Product
  // -------------------------------
  createProduct() {
    const product = this.createNewProduct('product1', 'Pear', this.taxonomy, 'ImageURL', 1000, 'TRY');
    console.log('[INSIDER][createProduct]: ', product);
  }

  // Ürün nesnesi oluşturma fonksiyonu
  createNewProduct(productId: string, productName: string, taxonomy: string[], imageURL: string, price: number, currency: string) {
    const stringArray = ['value1', 'value2', 'value3'];
    const product = window.Insider.createNewProduct(productId, productName, taxonomy, imageURL, price, currency);

    product
      .setColor('red')
      .setVoucherName('voucherName')
      .setVoucherDiscount(10.5)
      .setPromotionName('promotionName')
      .setPromotionDiscount(10.5)
      .setSize('size')
      .setSalePrice(10.5)
      .setShippingCost(10.5)
      .setQuantity(10)
      .setStock(10)
      .setCustomAttributeWithString('string_parameter', 'This is Insider.')
      .setCustomAttributeWithInt('int_parameter', 10)
      .setCustomAttributeWithDouble('double_parameter', 10.5)
      .setCustomAttributeWithBoolean('bool_parameter', true)
      .setCustomAttributeWithDate('date_parameter', new Date());

    product.setCustomAttributeWithArray('array_parameter', stringArray);

    return product;
  }

  // -------------------------------
  // Purchase
  // -------------------------------
  async itemAddToCart() {
    const product = this.createNewProduct('product_id', 'Pear', this.taxonomy, 'ImageURL', 1000, 'TRY');
    await window.Insider.itemAddedToCart(product);
    console.log('[INSIDER][itemAddToCart]: Method is triggered, Product: ', product);
  }

  async itemRemoveFromCart() {
    const productID = 'product_id';
    await window.Insider.itemRemovedFromCart(productID);
    console.log('[INSIDER][itemRemoveFromCart]: Method is triggered, Product ID: ', productID);
  }

  async itemPurchase() {
    const product = this.createNewProduct('product_id', 'Pear', this.taxonomy, 'ImageURL', 1000, 'TRY');
    await window.Insider.itemPurchased('product_id', product);
    console.log('[INSIDER][itemPurchase]: Method is triggered, Product: ', product);
  }

  async cartClear() {
    window.Insider.cartCleared();
    console.log('[INSIDER][cartClear]: Method is triggered.');
  }

  // -------------------------------
  // Smart Recommender
  // -------------------------------
  async getSmartRecommendation() {
    const product = this.createNewProduct('product1', 'Pear', this.taxonomy, 'ImageURL', 1000, 'TRY');

    const smartData = await window.Insider.getSmartRecommendation(1, 'tr_TR', 'TRY');
    console.log('[INSIDER][getSmartRecommendation]: ', smartData);

    const smartDataWithProduct = await window.Insider.getSmartRecommendationWithProduct(product, 1, 'tr_TR');
    console.log('[INSIDER][getSmartRecommendationWithProduct]: ', smartDataWithProduct);
  }

  // -------------------------------
  // Social Proof
  // -------------------------------
  socialProof() {
    this.productPage();
  }

  // -------------------------------
  // Page Visit Methods
  // -------------------------------
  async homePage() {
    await window.Insider.visitHomePage();
    console.log('[INSIDER][homePage]: Method is triggered.');
  }

  async categoryPage() {
    await window.Insider.visitListingPage(this.taxonomy);
    console.log('[INSIDER][categoryPage]: Method is triggered.');
  }

  async productPage() {
    const product = this.createNewProduct('product1', 'Pear', this.taxonomy, 'ImageURL', 1000, 'TRY');
    await window.Insider.visitProductDetailPage(product);
    console.log('[INSIDER][productPage]: Method is triggered.');
  }

  async cartPage() {
    const product1 = this.createNewProduct('product1', 'Pear', this.taxonomy, 'ImageURL', 1000, 'TRY');
    const product2 = this.createNewProduct('product2', 'Apple', this.taxonomy, 'ImageURL', 50, 'TRY');

    const insiderExampleProducts = [product1, product2];
    await window.Insider.visitCartPage(insiderExampleProducts);
    console.log('[INSIDER][cartPage]: Method is triggered.');
  }

  // -------------------------------
  // GDPR
  // -------------------------------
  async gdprTrue() {
    window.Insider.setGDPRConsent(true);
    console.log('[INSIDER][setGDPR]: true');
  }

  async gdprFalse() {
    window.Insider.setGDPRConsent(false);
    console.log('[INSIDER][setGDPR]: false');
  }

  // -------------------------------
  // Message Center
  // -------------------------------
  async getMessageCenterData() {
    const startDate = new Date(Date.now() - 86400000);
    const endDate = new Date(Date.now() + 86400000);

    const data = await window.Insider.getMessageCenterData(100, startDate, endDate);
    console.log('[INSIDER][messageCenter]: ', data);
  }

  // -------------------------------
  // Content Optimizer
  // -------------------------------
  async contentOptimizer() {
    // Integer
    const contentOptimizerInt = await window.Insider.getContentIntWithName(
      'int_variable_name',
      10,
      Insider.contentOptimizerDataType.ELEMENT,
    );
    console.log('[INSIDER][getContentIntWithName]: ', contentOptimizerInt);

    // String
    const contentOptimizerString = await window.Insider.getContentStringWithName(
      'string_variable_name',
      'defaultValue',
      Insider.contentOptimizerDataType.ELEMENT,
    );
    console.log('[INSIDER][getContentStringWithName]: ', contentOptimizerString);

    // Boolean
    const contentOptimizerBool = await window.Insider.getContentBoolWithName(
      'bool_variable_name',
      true,
      Insider.contentOptimizerDataType.ELEMENT,
    );
    console.log('[INSIDER][getContentBoolWithName]: ', contentOptimizerBool);
  }
}