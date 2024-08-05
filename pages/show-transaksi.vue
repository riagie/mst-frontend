<template>
    <div>
        <b-container class="my-5">
            <b-row>
                <b-col>
                    <b-card title="Daftar Transaksi" class="mb-4">
                        <b-table :items="transactions" :fields="fields" striped hover bordered responsive>
                            <template #cell(jumlah_barang)="data">
                                {{ calculateTotalQty(data.item.sales_det) }}
                            </template>
                            <template #cell(total)="data">
                                {{ calculateGrandTotal(data.item.sales_det) }}
                            </template>
                            <template #cell(subtotal)="data">
                                <b-badge variant="success">{{ formatCurrency(data.item.subtotal) }}</b-badge>
                            </template>
                            <template #cell(diskon)="data">
                                <b-badge variant="warning">{{ formatCurrency(data.item.diskon) }}</b-badge>
                            </template>
                            <template #cell(ongkir)="data">
                                <b-badge variant="info">{{ formatCurrency(data.item.ongkir) }}</b-badge>
                            </template>
                            <template #cell(grand_total)="data">
                                <b-badge variant="danger">{{ formatCurrency(calculateGrandTotal(data.item.sales_det))
                                    }}</b-badge>
                            </template>
                        </b-table>
                    </b-card>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-button href="/" variant="primary">Back to Home</b-button>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
    async asyncData({ $axios }) {
        return $axios.$get('/transaksi').then((response) => {
            return { transactions: response }
        })
    },
    data() {
        return {
            fields: [
                { key: 'kode', label: 'No-TRX' },
                { key: 'tgl', label: 'Tanggal' },
                { key: 'customer.name', label: 'Nama Customer' },
                { key: 'jumlah_barang', label: 'Jumlah Barang' },
                { key: 'subtotal', label: 'Sub Total' },
                { key: 'diskon', label: 'Diskon' },
                { key: 'ongkir', label: 'Ongkir' },
                { key: 'total', label: 'Total' },
                { key: 'grand_total', label: 'Grand Total' }
            ]
        }
    },
    methods: {
        calculateTotalQty(salesDet) {
            return salesDet.reduce((total, item) => total + item.qty, 0);
        },
        calculateGrandTotal(salesDet) {
            return salesDet.reduce((total, item) => total + parseFloat(item.total), 0).toFixed(2);
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
        }
    }
}
</script>

<style scoped>
/* Styling for better visuals */
b-card {
    background-color: #f8f9fa;
}

b-table {
    border: 1px solid #dee2e6;
}

b-badge {
    font-size: 0.875rem;
}

b-button {
    margin-top: 1rem;
}
</style>