function is_valid_barcode(barcode) {
    // check length
    // if (barcode.length != 6) {
    //     return false;
    // }
    // return true;
    var last_digit = Number(barcode.substring(barcode.length - 1));
    var check_sum = 0;
    if (isNaN(last_digit)) {
        console.log("isNaN(last_digit)")
        return false;
    } // not a valid upc/ean

    var barcode_array = barcode.substring(0, barcode.length - 1).split("").reverse();
    var odd_total = 0,
        even_total = 0;

    for (var i = 0; i < barcode_array.length; i++) {
        if (isNaN(barcode_array[i])) {
            return false;
        }

        if (i % 2 == 0) {
            odd_total += Number(barcode_array[i]) * 3;
        } else {
            even_total += Number(barcode_array[i]);
        }
    }

    check_sum = (10 - ((even_total + odd_total) % 10)) % 10;
    console.log('checksum', check_sum, 'last', last_digit)
    return check_sum == last_digit;
}




$('#tassimo-code-decimal').on('change keyup', function(e) {

    var code_str = $('#tassimo-code-decimal').val().split('-').join('');

    if (code_str.length > 2) {
      let substring1 = code_str.slice(0, code_str.length - 1),
        substring2 = code_str.slice(code_str.length - 1, code_str.length);
      code_str = substring1 + '-' + substring2;
      $('#tassimo-code-decimal').val(code_str)
    }

    code_str = code_str.split('-').join('');

    var output = {};

    if (is_valid_barcode(code_str)) {
        $('#tassimo-code-decimal').removeClass('invalid');
        console.log('valid')

        code_str = code_str.slice(0, code_str.length - 1);
        let code_dec = (+code_str);
        // “10 00 1000 111 10
        // 10    Water temperature of 83° C.
        // 00    Fast charge with soak
        // 1000  Dispensed drink volume of 150 ml
        // 111   Flow rate equals 100%
        // 10    Fast air flow purge? short period.
        let code = (code_dec >>> 0);
        // let code = 0b1000100011110;
        let white_spaces = [2, 5, 9, 11]

        var code_text = "";
        for (var i = 12; i >= 0; i--) {
            let position = (1 << i);
            let bit = (code & (1 << i)) >> i;

            code_text = code_text + "" + bit;
            if (white_spaces.indexOf(i) > -1) {
                code_text = code_text + " "
            }
        }

        let code_bin = code.toString(2);

        // https://patentimages.storage.googleapis.com/a8/ab/e5/dfdcc17a85d105/US7231869.pdf
        //10 001 0001 11 10
        //00 000 0000 00 00
        let water_temperature = (code & 0b1100000000000) >>> 11;
        let cartridge_charge = (code & 0b0011000000000) >>> 9;
        let beverage_volume = (code & 0b0000111100000) >>> 5;
        let flow_rate = (code & 0b0000000011100) >>> 2;
        let purge = (code & 0b0000000000011) >>> 0;



        tassimo_config = {
            water_temperature: {
                0b00: "cold",
                0b01: "warm",
                0b10: "83 &#176; C",
                0b11: "93 &#176; C"
            },
            cartridge_charge: {
                0b00: "fast charge with soak",
                0b01: "fast charge without soak",
                0b10: "slow charge with soak",
                0b11: "slow charge without soak "
            },
            beverage_volume: {
                0b0000: "50 ml",
                0b0001: "60 ml",
                0b0010: "70 ml",
                0b0011: "80 ml",
                0b0100: "90 ml",
                0b0101: "100 ml",
                0b0110: "110 ml",
                0b0111: "130 ml",
                0b1000: "150 ml",
                0b1001: "170 ml",
                0b1010: "190 ml",
                0b1011: "210 ml",
                0b1100: "230 ml",
                0b1101: "250 ml",
                0b1110: "275 ml",
                0b1111: "300 ml "
            },
            flow_rate: {
                0b000: "30%",
                0b001: "40%",
                0b010: "50%",
                0b011: "60%",
                0b100: "70%",
                0b101: "80%",
                0b110: "90%",
                0b111: "100%"
            },
            purge: {
                0b00: " slow flow / short period",
                0b01: " slow flow / long period",
                0b10: " fast flow / short period",
                0b11: " fast flow / long period"
            }
        }


        $('#tassimo-code-binary').val(code_text);

        output = {
            water_temperature: tassimo_config.water_temperature[water_temperature],
            cartridge_charge: tassimo_config.cartridge_charge[cartridge_charge],
            beverage_volume: tassimo_config.beverage_volume[beverage_volume],
            flow_rate: tassimo_config.flow_rate[flow_rate],
            purge: tassimo_config.purge[purge]
        };

    } else {
        console.log('in valid')
        $('#tassimo-code-decimal').addClass('invalid');
        $('#tassimo-code-binary').val("");
        output = {
            water_temperature: "",
            cartridge_charge: "",
            beverage_volume: "",
            flow_rate: "",
            purge: ""
        };
    }



    var $o = $('#output').show();
    _.forEach(output, function(v, k) {
        $o.find('[data-value=' + k + ']').html(v);
    });

})
