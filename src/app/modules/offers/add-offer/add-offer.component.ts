import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpProductsService } from '../../products/service/products.service';
import { FormBuilder, FormGroup, FormArray, Form, Validators } from '@angular/forms';
import { BoxAnimation } from '../../../shared/animations/box-animation';
import { NotificationService } from '../../../shared/services/notifications/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss'],
  animations: [BoxAnimation]
})
export class AddOfferComponent implements OnInit, AfterViewInit {
  originProducts: any = [];
  imagePreview: string | ArrayBuffer;
  image: any;
  cloneProducts: any = [];
  fromApi = {};
  minDate = new Date();
  maxDate = new Date(2020, 0, 1);
  selectedOptions = {};
  listOfOptions = [];
  finalProducts = [];
  offerForm: FormGroup;
  offerDetailForm: FormGroup;
  selectedChoicesList: any[] = [];
  result: any = [];
  total: any = 0;
  listOfChoices: any = {};
  countProducts = {};
  totalPrice: number;
  constructor(
    private httpProductsService: HttpProductsService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.offerDetailForm = this.formBuilder.group({
      discount_percentage: [null, Validators.required],
      total_price: [null, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required]
    })
    this.offerForm = this.formBuilder.group({
      products: this.formBuilder.array([])
    })

    this.httpProductsService.getSelectedProducts().subscribe(data => {
      this.fromApi = JSON.parse(JSON.stringify(data));
      this.originProducts = JSON.parse(JSON.stringify(this.fromApi));
      this.cloneProducts = [...this.initOptions(JSON.parse(JSON.stringify(data)))];
      this.initializeProducts(this.initOptions(JSON.parse(JSON.stringify(data))));
    })

    this.getProducts();

  }

  getProducts() {
    let products = (<FormArray>this.offerForm.controls.products).controls;
    return products;
  }

  initializeProducts(cloneProducts) {
    let productsControls: FormArray = this.offerForm.get('products') as FormArray;
    for (let c of cloneProducts) {
      productsControls.push(this.formBuilder.group({
        name: c.name,
        _id: c._id,
        options: this.setOptions(c.options),
      }))
    }
    return productsControls;
  }

  setOptions(productOptions) {
    let options = new FormArray([]);
    productOptions.forEach(option => {
      this.createOption(options, option);
    });
    return options;
  }

  // append the image and backround to formData
  appendImagesToProduct(formData, productData) {
    formData.append("image", this.image);
    formData.append("data", JSON.stringify(productData));
  }

  createOption(options, option) {
    options.push(this.formBuilder.group({
      is_mandatory: option.is_mandatory,
      is_multiple_choice: option.is_multiple_choice,
      is_connected_to_previous_option: option.is_connected_to_previous_option,
      _id: option._id,
      choices: this.setChoices(option.choices),
      category: this.formBuilder.group({
        _id: option.category._id,
        name: option.category.name,
        logo: option.category.logo,
        logo_active: option.category.logo_active,
        created_at: option.category.created_at,
        updated_at: option.category.updated_at
      }),
      is_overriding_price: option.is_overriding_price,
      question: option.question,
    }))
  }

  setChoices(optionChoices) {
    let choices = new FormArray([]);
    optionChoices.forEach(choice => {
      choices.push(this.formBuilder.group({
        item: this.formBuilder.group({
          _id: choice.item._id,
          name: choice.item.name,
          category: choice.item.category,
          created_at: choice.item.created_at,
          updated_at: choice.item.updated_at,
        }),
        _id: choice._id,
        connected_items: this.formBuilder.array(choice.connected_items),
        price: choice.price,
      }))
    });
    return choices;
  }


  initOptions(products) {
    let clone = [...products];
    for (let i = 0; i < clone.length; i++) {
      let options = clone[i].options[0];
      let optionsList = {};
      optionsList = clone[i].options[0];
      clone[i].options = [];
      clone[i].options.push(options);
      this.listOfOptions.push([optionsList]);
    }
    return clone;
  }

  addNewOption(option, index) {
    this.cloneProducts.map(cloneProduct => cloneProduct.options)[index]
  }


  setNextOption(optionIndex, choiceindex, selectedChoiceId, choiceControl, choicesControls) {


    (<FormArray>choicesControls)
      .controls
      .forEach(control => {
        for (let x = 0; x < this.listOfOptions[optionIndex].length; x++) {
          if (this.listOfOptions[optionIndex][x].is_multiple_choice === false) {
            control.disable();
            this.initLastProducts();
          } else {
            control.enable();
            this.initLastProducts();
          }
        }
      });

    this.selectedChoicesList.push(choiceControl.value._id);
    this.offerDetailForm.controls.total_price.setValue(this.total);

    let control = (<FormArray>this.offerForm.controls.products).controls[optionIndex]['controls']['options']['controls'];
    if (this.originProducts[optionIndex].options.length > this.listOfOptions[optionIndex].length) {
      let nextOption = this.getNextOption(optionIndex, choiceindex);
      let nextOptionChoices = this.getNextOptionChoices(nextOption, selectedChoiceId);

      // if (nextOptionChoices === undefined || nextOptionChoices.length == 0) {
      //   nextOptionChoices = [...nextOption.choices]
      // }

      if (this.originProducts[optionIndex].options.length === this.listOfOptions[optionIndex].length) {
        return;
      }
      if (nextOption.is_connected_to_previous_option && nextOption !== undefined) {
        this.renderNextOption(control, nextOption, nextOptionChoices);
        this.listOfOptions[optionIndex].push(nextOption);

      }

      if (!nextOption.is_connected_to_previous_option) {
        this.renderNextOption(control, nextOption, nextOptionChoices);
        this.listOfOptions[optionIndex].push(nextOption);
      };

    }
    return control;
  }

  getNextOptionChoices(nextOption, selectedChoiceId) {
    let connected_items = nextOption.choices.filter(choice => choice.connected_items.includes(selectedChoiceId));
    return connected_items;
  }

  getCountOfProducts(event, index) {
    if (!this.countProducts[index]) {
      this.countProducts[index] = {};
    }
    this.countProducts[index] = event.target.value;

  }

  setNextChoiceIndex(optionIndex, choiceindex) {
    return `${optionIndex}${choiceindex + 1}`.toString();
  }


  resetOptions(index) {
    let optionControl = (<FormArray>this.offerForm.controls.products).controls[index]['controls']['options'];
    let currentOptions = this.originProducts[index].options;
    for (let x = 0; x < currentOptions.length; x++) {
      const choices = currentOptions[x].choices;
      let mappingChoicesId = choices.map(choice => choice._id);
      this.selectedChoicesList = this.selectedChoicesList.filter(selectedChoice => !mappingChoicesId.includes(selectedChoice));
    }


    let productOptions = this.originProducts[index].options[0];
    while (optionControl.length !== 0) {
      optionControl.removeAt(0);
    }
    this.createOption(optionControl, productOptions);
    this.listOfOptions[index].length = 1;
    this.listOfChoices = this.listOfChoices.filter(choice => this.selectedChoicesList.indexOf(choice._id) > -1);
  }


  refreshTheChoicesIds(choices) {
    return this.selectedChoicesList.filter(selectedChoice => choices.includes(selectedChoice))
  }



  renderNextOption(control, nextOption, existChoices) {
    control.push(this.formBuilder.group({
      is_mandatory: nextOption.is_mandatory,
      is_multiple_choice: nextOption.is_multiple_choice,
      is_connected_to_previous_option: nextOption.is_connected_to_previous_option,
      _id: nextOption._id,
      choices: this.setChoices(existChoices),
      category: this.formBuilder.group({
        _id: nextOption.category._id,
        name: nextOption.category.name,
        logo: nextOption.category.logo,
        logo_active: nextOption.category.logo_active,
        created_at: nextOption.category.created_at,
        updated_at: nextOption.category.updated_at
      }),
      is_overriding_price: nextOption.is_overriding_price,
      question: nextOption.question,
    }))
  }


  getAllLastChoicesForOptions(choices, compareTo) {
    let intersection = choices.filter(element => compareTo.indexOf(element._id) !== -1).map(choice => {
      return choice._id
    });
    return intersection;
  }




  getRadioButtonGroupName(index, j, option, choiceIdx) {
    let name = `size${j}${index}`;
    if (option.value.is_multiple_choice) {
      name = `size${index}${choiceIdx}${option._id}`;
    } else {
      name = `size${j}${index}`
    }
    return name;
  }

  getNextOption(productIndex, optionIndex) {
    return this.originProducts[productIndex].options[optionIndex + 1];
  }

  ngAfterViewInit() {
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return this.notificationService.errorNotification(
        "This file is not supported, please upload image"
      );
    }
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);

  }


  initLastProducts() {
    // this.finalProducts = [];
    // const control = (<FormArray>this.offerForm.controls.products).controls;
    // for (let i = 0; i < control.length; i++) {
    //   const productControl = control[i]['controls'];
    //   let options = [];
    //   for (let j = 0; j < productControl.options.controls.length; j++) {
    //     const option = productControl.options.controls[j];
    //     let choices = [];
    //     for (let c = 0; c < option.controls.choices.controls.length; c++) {
    //       const choice = option.controls.choices.controls[c];
    //       choices.push({ _id: choice.value._id, price: choice.value.price });
    //     }
    //     options.push({
    //       _id: option.value._id,
    //       is_selected: this.getAllLastChoicesForOptions(choices, this.selectedChoicesList).length === undefined || this.getAllLastChoicesForOptions(choices, this.selectedChoicesList).length == 0 ? false : true,
    //       choices: this.getAllLastChoicesForOptions(choices, this.selectedChoicesList),
    //       price: this.getChoicePrice(choices, this.selectedChoicesList, this.countProducts[i]),
    //       count: parseInt(this.countProducts[i])
    //     });

    //     let productIndex = this.finalProducts.map(x => x.product_id).indexOf(productControl._id.value);
    //     if (!this.finalProducts[productIndex]) {
    //       this.finalProducts.push({
    //         count: parseInt(this.countProducts[i]),
    //         product_id: productControl._id.value,
    //         options: options
    //       })
    //     }
    //   }
    // }


    this.finalProducts = [];
    for (let i = 0; i < this.originProducts.length; i++) {
      const product = this.originProducts[i]
      let options = [];
      for (let j = 0; j < product.options.length; j++) {
        const option = product.options[j];
        let choices = [];
        for (let c = 0; c < option.choices.length; c++) {
          const choice = option.choices[c];
          choices.push({ _id: choice._id, price: choice.price });
        }
        options.push({
          _id: option._id,
          is_selected: this.getAllLastChoicesForOptions(choices, this.selectedChoicesList).length === undefined || this.getAllLastChoicesForOptions(choices, this.selectedChoicesList).length == 0 ? false : true,
          choices: this.getAllLastChoicesForOptions(choices, this.selectedChoicesList),
          price: this.getChoicePrice(choices, this.selectedChoicesList, this.countProducts[i]),
          count: parseInt(this.countProducts[i])
        });

        let productIndex = this.finalProducts.map(x => x.product_id).indexOf(product._id) > -1;
        if (!productIndex) {
          this.finalProducts.push({
            count: parseInt(this.countProducts[i]),
            product_id: product._id,
            options: options
          })
        }
      }
    }
    this.getLastChoicesPrices(this.finalProducts);
  }

  getChoicePrice(choices, compareTo, countProduct) {
    let price = choices.filter(element => compareTo.indexOf(element._id) !== -1).map(choice => choice.price).join('');
    price = price * countProduct;
    return price;
  }

  getLastChoicesPrices(finalProducts) {
    let fOptions = finalProducts.map(product => product.options.filter(option => +option.price > 0 && option.price !== []));
    let fPrice = [].concat.apply([], fOptions).map(option => option.price).reduce((a, b, currentIndex) => a + b, 0);
    this.total = fPrice;
    this.offerDetailForm.controls.total_price.setValue(this.total);
    return this.total;
  }

  submit() {
    this.initLastProducts();

    const data = {
      order: {
        products: this.finalProducts,
        total_order_price: this.total
      },
      from: this.fromJsonDate(this.offerDetailForm.controls.from.value),
      to: this.fromJsonDate(this.offerDetailForm.controls.to.value),
      discount: parseInt(this.offerDetailForm.controls.discount_percentage.value)
    }

    if (data.from === null || data.to === null || data.discount === null) {
      this.notificationService.errorNotification('Please fill the data correctly!');
      return;
    }

    const formData = new FormData();
    this.appendImagesToProduct(formData, data);

    this.httpProductsService.createOffer(formData).subscribe(data => {
      if (data.status === 200) {
        this.notificationService.successNotification('Offer createrd')
      }
    }, err => {
      if (err.status === 400) {
        this.notificationService.errorNotification(`${err.error.message}`);
      }
    })

  }

  fromJsonDate(jDate): string {
    const bDate: Date = new Date(jDate);
    return bDate.toISOString().substring(0, 10);  //Ignore time
  }
  caluDiscount(event) {
    let currentDiscount;
    let finialPrice;
    let originalPrice = this.total;
    let discountPer = this.offerDetailForm.controls.discount_percentage.value;

    if (originalPrice && discountPer) {
      currentDiscount = (discountPer * originalPrice) / 100;
      finialPrice = (originalPrice - currentDiscount) || originalPrice;
      this.offerDetailForm.controls.total_price.setValue(finialPrice);
    }
    this.initLastProducts();
  }

  setTotalItemsPrice() {
    this.total = this.listOfChoices.filter(choice => this.selectedChoicesList.indexOf(choice._id) > -1)
    // this.total = this.listOfChoices.map(choice => choice.price).reduce((a, b) => a + b, 0);
    this.offerDetailForm.controls.total_price.setValue(this.total);
    return this.total;
  }
  // write a function that take an array
  // this array contain numbers from 1 to 20 
  // return new array that contains numbers that greater than number 7

}
