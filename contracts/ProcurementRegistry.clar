(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-INVALID-DESCRIPTION u101)
(define-constant ERR-INVALID-BUDGET u102)
(define-constant ERR-INVALID-DEADLINE u103)
(define-constant ERR-INVALID-START-DATE u104)
(define-constant ERR-INVALID-EVAL-CRITERIA u105)
(define-constant ERR-PROCUREMENT-ALREADY-EXISTS u106)
(define-constant ERR-PROCUREMENT-NOT-FOUND u107)
(define-constant ERR-INVALID-TIMESTAMP u108)
(define-constant ERR-AUTHORITY-NOT-VERIFIED u109)
(define-constant ERR-INVALID-MIN-BID u110)
(define-constant ERR-INVALID-MAX-BID u111)
(define-constant ERR-UPDATE-NOT-ALLOWED u112)
(define-constant ERR-INVALID-UPDATE-PARAM u113)
(define-constant ERR-MAX-PROCUREMENTS-EXCEEDED u114)
(define-constant ERR-INVALID-PROCUREMENT-TYPE u115)
(define-constant ERR-INVALID-LOCATION u116)
(define-constant ERR-INVALID-CURRENCY u117)
(define-constant ERR-INVALID-STATUS u118)
(define-constant ERR-INVALID-DEPARTMENT u119)
(define-constant ERR-INVALID-CATEGORY u120)
(define-constant ERR-INVALID-QUANTITY u121)
(define-constant ERR-INVALID-UNIT u122)
(define-constant ERR-INVALID-DELIVERY-TIME u123)
(define-constant ERR-INVALID-PAYMENT-TERMS u124)
(define-constant ERR-INVALID-WARRANTY-PERIOD u125)

(define-data-var next-procurement-id uint u0)
(define-data-var max-procurements uint u10000)
(define-data-var creation-fee uint u5000)
(define-data-var authority-contract (optional principal) none)

(define-map procurements
  uint
  {
    title: (string-utf8 200),
    description: (string-utf8 1000),
    budget: uint,
    deadline: uint,
    start-date: uint,
    eval-criteria: (string-utf8 500),
    timestamp: uint,
    creator: principal,
    procurement-type: (string-utf8 50),
    location: (string-utf8 100),
    currency: (string-utf8 20),
    status: (string-utf8 20),
    min-bid: uint,
    max-bid: uint,
    department: (string-utf8 100),
    category: (string-utf8 100),
    quantity: uint,
    unit: (string-utf8 50),
    delivery-time: uint,
    payment-terms: (string-utf8 200),
    warranty-period: uint
  }
)

(define-map procurements-by-title
  (string-utf8 200)
  uint)

(define-map procurement-updates
  uint
  {
    update-title: (string-utf8 200),
    update-description: (string-utf8 1000),
    update-budget: uint,
    update-timestamp: uint,
    updater: principal
  }
)

(define-read-only (get-procurement (id uint))
  (map-get? procurements id)
)

(define-read-only (get-procurement-updates (id uint))
  (map-get? procurement-updates id)
)

(define-read-only (is-procurement-registered (title (string-utf8 200)))
  (is-some (map-get? procurements-by-title title))
)

(define-private (validate-title (title (string-utf8 200)))
  (if (and (> (len title) u0) (<= (len title) u200))
      (ok true)
      (err ERR-INVALID-UPDATE-PARAM))
)

(define-private (validate-description (desc (string-utf8 1000)))
  (if (and (> (len desc) u0) (<= (len desc) u1000))
      (ok true)
      (err ERR-INVALID-DESCRIPTION))
)

(define-private (validate-budget (budget uint))
  (if (> budget u0)
      (ok true)
      (err ERR-INVALID-BUDGET))
)

(define-private (validate-deadline (deadline uint))
  (if (> deadline block-height)
      (ok true)
      (err ERR-INVALID-DEADLINE))
)

(define-private (validate-start-date (start uint))
  (if (>= start block-height)
      (ok true)
      (err ERR-INVALID-START-DATE))
)

(define-private (validate-eval-criteria (criteria (string-utf8 500)))
  (if (and (> (len criteria) u0) (<= (len criteria) u500))
      (ok true)
      (err ERR-INVALID-EVAL-CRITERIA))
)

(define-private (validate-timestamp (ts uint))
  (if (>= ts block-height)
      (ok true)
      (err ERR-INVALID-TIMESTAMP))
)

(define-private (validate-procurement-type (type (string-utf8 50)))
  (if (or (is-eq type "goods") (is-eq type "services") (is-eq type "works"))
      (ok true)
      (err ERR-INVALID-PROCUREMENT-TYPE))
)

(define-private (validate-location (loc (string-utf8 100)))
  (if (and (> (len loc) u0) (<= (len loc) u100))
      (ok true)
      (err ERR-INVALID-LOCATION))
)

(define-private (validate-currency (cur (string-utf8 20)))
  (if (or (is-eq cur "STX") (is-eq cur "USD") (is-eq cur "BTC"))
      (ok true)
      (err ERR-INVALID-CURRENCY))
)

(define-private (validate-status (stat (string-utf8 20)))
  (if (or (is-eq stat "open") (is-eq stat "closed") (is-eq stat "awarded"))
      (ok true)
      (err ERR-INVALID-STATUS))
)

(define-private (validate-min-bid (min uint))
  (if (> min u0)
      (ok true)
      (err ERR-INVALID-MIN-BID))
)

(define-private (validate-max-bid (max uint))
  (if (> max u0)
      (ok true)
      (err ERR-INVALID-MAX-BID))
)

(define-private (validate-department (dept (string-utf8 100)))
  (if (and (> (len dept) u0) (<= (len dept) u100))
      (ok true)
      (err ERR-INVALID-DEPARTMENT))
)

(define-private (validate-category (cat (string-utf8 100)))
  (if (and (> (len cat) u0) (<= (len cat) u100))
      (ok true)
      (err ERR-INVALID-CATEGORY))
)

(define-private (validate-quantity (qty uint))
  (if (> qty u0)
      (ok true)
      (err ERR-INVALID-QUANTITY))
)

(define-private (validate-unit (unit (string-utf8 50)))
  (if (and (> (len unit) u0) (<= (len unit) u50))
      (ok true)
      (err ERR-INVALID-UNIT))
)

(define-private (validate-delivery-time (time uint))
  (if (> time u0)
      (ok true)
      (err ERR-INVALID-DELIVERY-TIME))
)

(define-private (validate-payment-terms (terms (string-utf8 200)))
  (if (and (> (len terms) u0) (<= (len terms) u200))
      (ok true)
      (err ERR-INVALID-PAYMENT-TERMS))
)

(define-private (validate-warranty-period (period uint))
  (if (>= period u0)
      (ok true)
      (err ERR-INVALID-WARRANTY-PERIOD))
)

(define-private (validate-principal (p principal))
  (if (not (is-eq p 'SP000000000000000000002Q6VF78))
      (ok true)
      (err ERR-NOT-AUTHORIZED))
)

(define-public (set-authority-contract (contract-principal principal))
  (begin
    (try! (validate-principal contract-principal))
    (asserts! (is-none (var-get authority-contract)) (err ERR-AUTHORITY-NOT-VERIFIED))
    (var-set authority-contract (some contract-principal))
    (ok true)
  )
)

(define-public (set-max-procurements (new-max uint))
  (begin
    (asserts! (> new-max u0) (err ERR-MAX-PROCUREMENTS-EXCEEDED))
    (asserts! (is-some (var-get authority-contract)) (err ERR-AUTHORITY-NOT-VERIFIED))
    (var-set max-procurements new-max)
    (ok true)
  )
)

(define-public (set-creation-fee (new-fee uint))
  (begin
    (asserts! (>= new-fee u0) (err ERR-INVALID-UPDATE-PARAM))
    (asserts! (is-some (var-get authority-contract)) (err ERR-AUTHORITY-NOT-VERIFIED))
    (var-set creation-fee new-fee)
    (ok true)
  )
)

(define-public (create-procurement
  (title (string-utf8 200))
  (description (string-utf8 1000))
  (budget uint)
  (deadline uint)
  (start-date uint)
  (eval-criteria (string-utf8 500))
  (procurement-type (string-utf8 50))
  (location (string-utf8 100))
  (currency (string-utf8 20))
  (min-bid uint)
  (max-bid uint)
  (department (string-utf8 100))
  (category (string-utf8 100))
  (quantity uint)
  (unit (string-utf8 50))
  (delivery-time uint)
  (payment-terms (string-utf8 200))
  (warranty-period uint)
)
  (let (
        (next-id (var-get next-procurement-id))
        (current-max (var-get max-procurements))
        (authority (var-get authority-contract))
      )
    (asserts! (< next-id current-max) (err ERR-MAX-PROCUREMENTS-EXCEEDED))
    (try! (validate-title title))
    (try! (validate-description description))
    (try! (validate-budget budget))
    (try! (validate-deadline deadline))
    (try! (validate-start-date start-date))
    (try! (validate-eval-criteria eval-criteria))
    (try! (validate-procurement-type procurement-type))
    (try! (validate-location location))
    (try! (validate-currency currency))
    (try! (validate-min-bid min-bid))
    (try! (validate-max-bid max-bid))
    (try! (validate-department department))
    (try! (validate-category category))
    (try! (validate-quantity quantity))
    (try! (validate-unit unit))
    (try! (validate-delivery-time delivery-time))
    (try! (validate-payment-terms payment-terms))
    (try! (validate-warranty-period warranty-period))
    (asserts! (is-none (map-get? procurements-by-title title)) (err ERR-PROCUREMENT-ALREADY-EXISTS))
    (let ((authority-recipient (unwrap! authority (err ERR-AUTHORITY-NOT-VERIFIED))))
      (try! (stx-transfer? (var-get creation-fee) tx-sender authority-recipient))
    )
    (map-set procurements next-id
      {
        title: title,
        description: description,
        budget: budget,
        deadline: deadline,
        start-date: start-date,
        eval-criteria: eval-criteria,
        timestamp: block-height,
        creator: tx-sender,
        procurement-type: procurement-type,
        location: location,
        currency: currency,
        status: "open",
        min-bid: min-bid,
        max-bid: max-bid,
        department: department,
        category: category,
        quantity: quantity,
        unit: unit,
        delivery-time: delivery-time,
        payment-terms: payment-terms,
        warranty-period: warranty-period
      }
    )
    (map-set procurements-by-title title next-id)
    (var-set next-procurement-id (+ next-id u1))
    (print { event: "procurement-created", id: next-id })
    (ok next-id)
  )
)

(define-public (update-procurement
  (procurement-id uint)
  (update-title (string-utf8 200))
  (update-description (string-utf8 1000))
  (update-budget uint)
)
  (let ((proc (map-get? procurements procurement-id)))
    (match proc
      p
        (begin
          (asserts! (is-eq (get creator p) tx-sender) (err ERR-NOT-AUTHORIZED))
          (try! (validate-title update-title))
          (try! (validate-description update-description))
          (try! (validate-budget update-budget))
          (let ((existing (map-get? procurements-by-title update-title)))
            (match existing
              existing-id
                (asserts! (is-eq existing-id procurement-id) (err ERR-PROCUREMENT-ALREADY-EXISTS))
              (begin true)
            )
          )
          (let ((old-title (get title p)))
            (if (is-eq old-title update-title)
                (ok true)
                (begin
                  (map-delete procurements-by-title old-title)
                  (map-set procurements-by-title update-title procurement-id)
                  (ok true)
                )
            )
          )
          (map-set procurements procurement-id
            {
              title: update-title,
              description: update-description,
              budget: update-budget,
              deadline: (get deadline p),
              start-date: (get start-date p),
              eval-criteria: (get eval-criteria p),
              timestamp: block-height,
              creator: (get creator p),
              procurement-type: (get procurement-type p),
              location: (get location p),
              currency: (get currency p),
              status: (get status p),
              min-bid: (get min-bid p),
              max-bid: (get max-bid p),
              department: (get department p),
              category: (get category p),
              quantity: (get quantity p),
              unit: (get unit p),
              delivery-time: (get delivery-time p),
              payment-terms: (get payment-terms p),
              warranty-period: (get warranty-period p)
            }
          )
          (map-set procurement-updates procurement-id
            {
              update-title: update-title,
              update-description: update-description,
              update-budget: update-budget,
              update-timestamp: block-height,
              updater: tx-sender
            }
          )
          (print { event: "procurement-updated", id: procurement-id })
          (ok true)
        )
      (err ERR-PROCUREMENT-NOT-FOUND)
    )
  )
)

(define-public (close-procurement (procurement-id uint))
  (let ((proc (map-get? procurements procurement-id)))
    (match proc
      p
        (begin
          (asserts! (is-eq (get creator p) tx-sender) (err ERR-NOT-AUTHORIZED))
          (asserts! (is-eq (get status p) "open") (err ERR-INVALID-STATUS))
          (map-set procurements procurement-id
            (merge p { status: "closed" })
          )
          (print { event: "procurement-closed", id: procurement-id })
          (ok true)
        )
      (err ERR-PROCUREMENT-NOT-FOUND)
    )
  )
)

(define-public (get-procurement-count)
  (ok (var-get next-procurement-id))
)

(define-public (check-procurement-existence (title (string-utf8 200)))
  (ok (is-procurement-registered title))
)