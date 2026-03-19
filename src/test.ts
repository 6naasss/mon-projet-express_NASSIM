export function fizzbuzz() {
    for (let i = 1; i <= 100; i++) {
        let tmp = ""
        const is5 = (i % 5 == 0) || (i % 10 == 5)
        const is7 = (i % 7 == 0) || (i % 10 == 7)

        if (is5) {
            tmp += "fizz"
        }
        if (is7) {
            tmp += "buzz"
        }
        if (tmp == "") {
            tmp = String(i)
        }
        console.log(tmp)
    }
}

fizzbuzz()
