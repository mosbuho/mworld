package com.project.backend.entity;

public enum PaymentStatus {
    UNPAYMENT(0, "결제대기"),
    PAYMENTED(1, "결제완료"),
    CANCELED(2, "취소"),
    REFUNDED(3, "환불"),
    RETURNED(4, "반품"),
    EXCHANGED(5, "교환");

    private final int value;
    private final String label;

    private PaymentStatus(int value, String label) {
        this.value = value;
        this.label = label;
    }

    public int getValue() {
        return value;
    }

    public String getLabel() {
        return label;
    }

    public static PaymentStatus fromValue(int value) {
        for (PaymentStatus status : PaymentStatus.values()) {
            if (status.value == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status value: " + value);
    }
}
